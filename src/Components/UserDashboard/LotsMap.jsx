import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import arrowIconUrl from '../../assets/arrow.svg';


const availableIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});
const bookedIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});
const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function LotsMap({ lots, spaces, onBook, addBooking, user, bookings, searchTerm }) {
  console.log("LOTS:", lots);
  console.log("SEARCH TERM:", searchTerm);
  const [bookingSpaceId, setBookingSpaceId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [feedback, setFeedback] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setUserLocation(null)
      );
    }
  }, []);

  const arrowIcon = L.icon({
    iconUrl: arrowIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const match = searchTerm.trim()
    ? lots.find(lot =>
        lot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;
  const center = match
    ? [match.lat, match.lng]
    : lots.length > 0
      ? [lots[0].lat, lots[0].lng]
      : [-17.8292, 31.0522]; // Harare, Zimbabwe
  const zoom = match ? 16 : 12;

  // Effect to set notFound state
  useEffect(() => {
    if (searchTerm.trim() && !match) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  }, [searchTerm, match]);

  // Helper to update map view
  function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  }

  const handleBookSubmit = (e, spaceId) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      setFeedback("Please select start and end time.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setFeedback("End time must be after start time.");
      return;
    }
    // Check for booking overlap
    const overlap = bookings.some(
      (b) =>
        b.space_id === spaceId &&
        ((new Date(startTime) < new Date(b.end_time)) && (new Date(endTime) > new Date(b.start_time)))
    );
    if (overlap) {
      setFeedback("This space is currently occupied. Your request will be sent to the admin for approval.");
    } else {
      setFeedback("Parking space booked! Waiting for admin approval.");
    }
    addBooking({
      user_id: user.id,
      space_id: spaceId,
      start_time: startTime,
      end_time: endTime,
      status: 'pending',
    });
    setBookingSpaceId(null);
    setStartTime("");
    setEndTime("");
  };

  // Helper: is space booked?
  const isSpaceBooked = (space) => {
    return bookings.some(
      (b) => b.space_id === space.id && new Date(b.end_time) > new Date()
    );
  };

  return (
    <div style={{ height: 400, width: "100%", margin: "2rem 0" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
              <div><strong>Your Location</strong></div>
                </Popup>
              </Marker>
        )}
        {/* Per-space markers */}
        {spaces.map(space => {
          const lot = lots.find(l => l.id === space.lotId);
          if (!lot) return null;
          const booked = isSpaceBooked(space);
          const icon = booked ? bookedIcon : availableIcon;
          return (
            <Marker key={space.id} position={[space.lat, space.lng]} icon={icon}>
              <Popup>
                <div>
                  <strong>{space.name}</strong> <br />
                  <span style={{ color: booked ? '#b22222' : '#2563eb', fontWeight: 600 }}>
                    {booked ? 'Booked' : 'Available'}
                  </span>
                  <br />
                  <span>Lot: {lot.name}</span><br />
                  <span>Location: {lot.location}</span><br />
                  <span>Rate: ${space.rate_per_hour || 0}/hr</span>
                  <hr />
                  {!booked ? (
                    <>
                      <button style={{ marginLeft: 0 }} onClick={() => setBookingSpaceId(space.id)}>Book</button>
                          {bookingSpaceId === space.id && (
                            <form onSubmit={e => handleBookSubmit(e, space.id)} style={{ marginTop: 8 }}>
                              <label>
                                Start Time:
                                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                              </label>
                              <label>
                                End Time:
                                <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                              </label>
                              <button type="submit">Confirm</button>
                              <button type="button" onClick={() => setBookingSpaceId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                            </form>
                          )}
                    </>
                  ) : (
                    <span style={{ color: '#b22222' }}>This space is currently booked.</span>
                  )}
                  {feedback && bookingSpaceId === space.id && <div style={{ color: 'green', marginTop: 8 }}>{feedback}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {notFound && (
        <div style={{ color: 'red', marginTop: 8 }}>
          There is no such area in your map.
        </div>
      )}
    </div>
  );
}

export default LotsMap; 