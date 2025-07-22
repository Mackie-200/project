const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ParkingSpace = require('../models/ParkingSpace');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/parking-spaces
// @desc    Get all parking spaces with filters
// @access  Public
router.get('/', [
  query('city').optional().trim(),
  query('state').optional().trim(),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('lat').optional().isFloat(),
  query('lng').optional().isFloat(),
  query('radius').optional().isFloat({ min: 0 }),
  query('features').optional(),
  query('vehicleType').optional().isIn(['car', 'motorcycle', 'truck', 'van', 'rv', 'bicycle']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      city,
      state,
      maxPrice,
      minPrice,
      lat,
      lng,
      radius,
      features,
      vehicleType,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { status: 'active' };

    // Location filters
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');

    // Price filters
    if (minPrice || maxPrice) {
      query['pricing.hourly'] = {};
      if (minPrice) query['pricing.hourly'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.hourly'].$lte = parseFloat(maxPrice);
    }

    // Vehicle type filter
    if (vehicleType) {
      query.vehicleTypes = vehicleType;
    }

    // Features filter
    if (features) {
      const featureList = features.split(',');
      featureList.forEach(feature => {
        if (['covered', 'security', 'electricCharging', 'handicapAccessible', 'cameraMonitoring', 'lighting'].includes(feature)) {
          query[`features.${feature}`] = true;
        }
      });
    }

    // Geospatial query for nearby parking spaces
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const searchRadius = radius ? parseFloat(radius) : 10; // Default 10km

      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: searchRadius * 1000 // Convert km to meters
        }
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parkingSpaces = await ParkingSpace.find(query)
      .populate('owner', 'name businessName rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ParkingSpace.countDocuments(query);

    res.json({
      success: true,
      data: {
        parkingSpaces,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get parking spaces error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/parking-spaces/owner/my-spaces
// @desc    Get owner's parking spaces
// @access  Private (Owner/Admin)
router.get('/owner/my-spaces', authenticateToken, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { owner: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parkingSpaces = await ParkingSpace.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ParkingSpace.countDocuments(query);

    res.json({
      success: true,
      data: {
        parkingSpaces,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get owner parking spaces error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/parking-spaces/:id
// @desc    Get single parking space
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const parkingSpace = await ParkingSpace.findById(req.params.id)
      .populate('owner', 'name businessName phone email rating');

    if (!parkingSpace) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }

    res.json({
      success: true,
      data: { parkingSpace }
    });

  } catch (error) {
    console.error('Get parking space error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/parking-spaces
// @desc    Create new parking space
// @access  Private (Owner/Admin)
router.post('/', authenticateToken, requireRole(['owner', 'admin']), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim(),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('location.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  body('pricing.hourly').isFloat({ min: 0 }).withMessage('Hourly price must be a positive number'),
  body('pricing.daily').optional().isFloat({ min: 0 }),
  body('pricing.monthly').optional().isFloat({ min: 0 }),
  body('vehicleTypes').optional().isArray(),
  body('features').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const parkingSpaceData = {
      ...req.body,
      owner: req.user._id
    };

    const parkingSpace = new ParkingSpace(parkingSpaceData);
    await parkingSpace.save();

    await parkingSpace.populate('owner', 'name businessName');

    res.status(201).json({
      success: true,
      message: 'Parking space created successfully',
      data: { parkingSpace }
    });

  } catch (error) {
    console.error('Create parking space error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/parking-spaces/:id
// @desc    Update parking space
// @access  Private (Owner/Admin)
router.put('/:id', authenticateToken, requireOwnershipOrAdmin(ParkingSpace), [
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional().trim(),
  body('location.address').optional().trim().notEmpty(),
  body('location.city').optional().trim().notEmpty(),
  body('location.state').optional().trim().notEmpty(),
  body('location.zipCode').optional().trim().notEmpty(),
  body('location.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('location.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }),
  body('pricing.hourly').optional().isFloat({ min: 0 }),
  body('pricing.daily').optional().isFloat({ min: 0 }),
  body('pricing.monthly').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updatedParkingSpace = await ParkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name businessName');

    res.json({
      success: true,
      message: 'Parking space updated successfully',
      data: { parkingSpace: updatedParkingSpace }
    });

  } catch (error) {
    console.error('Update parking space error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/parking-spaces/:id
// @desc    Delete parking space
// @access  Private (Owner/Admin)
router.delete('/:id', authenticateToken, requireOwnershipOrAdmin(ParkingSpace), async (req, res) => {
  try {
    await ParkingSpace.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Parking space deleted successfully'
    });

  } catch (error) {
    console.error('Delete parking space error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/parking-spaces/owner/my-spaces
// @desc    Get owner's parking spaces
// @access  Private (Owner/Admin)
router.get('/owner/my-spaces', authenticateToken, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { owner: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const parkingSpaces = await ParkingSpace.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ParkingSpace.countDocuments(query);

    res.json({
      success: true,
      data: {
        parkingSpaces,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get owner parking spaces error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
