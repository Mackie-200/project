const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const ParkingSpace = require('../models/ParkingSpace');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private (User)
router.post('/', authenticateToken, [
  body('parkingSpaceId').isMongoId().withMessage('Valid parking space ID required'),
  body('startTime').isISO8601().withMessage('Valid start time required'),
  body('endTime').isISO8601().withMessage('Valid end time required'),
  body('vehicleInfo.licensePlate').trim().notEmpty().withMessage('License plate required'),
  body('vehicleInfo.make').optional().trim(),
  body('vehicleInfo.model').optional().trim(),
  body('vehicleInfo.color').optional().trim(),
  body('vehicleInfo.type').optional().isIn(['car', 'motorcycle', 'truck', 'van', 'rv', 'bicycle']),
  body('payment.method').isIn(['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay']).withMessage('Valid payment method required')
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

    const { parkingSpaceId, startTime, endTime, vehicleInfo, payment } = req.body;

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be in the future'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check if parking space exists and is available
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(404).json({
        success: false,
        message: 'Parking space not found'
      });
    }

    if (parkingSpace.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Parking space is not available'
      });
    }

    // Check for conflicting bookings
    const isAvailable = await Booking.checkAvailability(parkingSpaceId, start, end);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Parking space is not available for the selected time period'
      });
    }

    // Calculate pricing
    const durationHours = Math.ceil((end - start) / (1000 * 60 * 60));
    const baseRate = parkingSpace.pricing.hourly;
    const subtotal = baseRate * durationHours;
    const taxes = subtotal * 0.08; // 8% tax
    const fees = 2.50; // Processing fee
    const total = subtotal + taxes + fees;

    // Create booking
    const bookingData = {
      user: req.user._id,
      parkingSpace: parkingSpaceId,
      startTime: start,
      endTime: end,
      vehicleInfo,
      pricing: {
        baseRate,
        totalHours: durationHours,
        subtotal,
        taxes,
        fees,
        total
      },
      payment: {
        method: payment.method,
        status: 'pending'
      }
    };

    const booking = new Booking(bookingData);
    booking.generateQRCode();
    await booking.save();

    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'parkingSpace', select: 'title location pricing owner', populate: { path: 'owner', select: 'name businessName' } }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', authenticateToken, [
  query('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('parkingSpace', 'title location pricing owner')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('parkingSpace', 'title location pricing owner instructions')
      .populate('parkingSpace.owner', 'name businessName phone email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is the parking space owner/admin
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isParkingOwner = booking.parkingSpace.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isParkingOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['confirmed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('reason').optional().trim()
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

    const { status, reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('parkingSpace');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const isBookingOwner = booking.user.toString() === req.user._id.toString();
    const isParkingOwner = booking.parkingSpace.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isBookingOwner && !isParkingOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate status transitions
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify completed or cancelled bookings'
      });
    }

    // Only booking owner can cancel, only parking owner/admin can mark no_show
    if (status === 'cancelled' && !isBookingOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only booking owner can cancel'
      });
    }

    if (status === 'no_show' && !isParkingOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only parking space owner can mark as no-show'
      });
    }

    booking.status = status;
    if (reason) {
      if (isParkingOwner) booking.notes.owner = reason;
      else if (isAdmin) booking.notes.admin = reason;
      else booking.notes.user = reason;
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking }
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings/:id/checkin
// @desc    Check in to parking space
// @access  Private
router.post('/:id/checkin', authenticateToken, [
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }),
  body('method').optional().isIn(['qr_code', 'manual', 'automatic'])
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only booking owner can check in
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be confirmed to check in'
      });
    }

    if (booking.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in'
      });
    }

    // Check if it's time to check in (within 15 minutes of start time)
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const timeDiff = startTime - now;
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff > 15) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is only available 15 minutes before start time'
      });
    }

    booking.checkIn = {
      time: now,
      method: req.body.method || 'qr_code',
      location: req.body.location
    };
    booking.status = 'active';

    await booking.save();

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: { booking }
    });

  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bookings/:id/checkout
// @desc    Check out from parking space
// @access  Private
router.post('/:id/checkout', authenticateToken, [
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }),
  body('method').optional().isIn(['qr_code', 'manual', 'automatic'])
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only booking owner can check out
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Must be checked in to check out'
      });
    }

    if (booking.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out'
      });
    }

    const now = new Date();
    booking.checkOut = {
      time: now,
      method: req.body.method || 'qr_code',
      location: req.body.location
    };
    booking.status = 'completed';

    await booking.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: { booking }
    });

  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/bookings/owner/my-bookings
// @desc    Get bookings for owner's parking spaces
// @access  Private (Owner/Admin)
router.get('/owner/my-bookings', authenticateToken, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Get owner's parking spaces
    const ownerSpaces = await ParkingSpace.find({ owner: req.user._id }).select('_id');
    const spaceIds = ownerSpaces.map(space => space._id);

    let query = { parkingSpace: { $in: spaceIds } };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('parkingSpace', 'title location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
