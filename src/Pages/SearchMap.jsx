import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const mockSpots = [
  { id: 1, name: "City Center", area: "Harare", lat: -17.8292, lng: 31.0522 },
  { id: 2, name: "Westgate Mall", area: "Westgate", lat: -17.7833, lng: 30.9667 },
  { id: 3, name: "Avondale", area: "Avondale", lat: -17.7831, lng: 31.0335 },
  { id: 4, name: "Bulawayo CBD", area: "Bulawayo", lat: -20.1500, lng: 28.5833 },
  { id: 5, name: "Mutare Center", area: "Mutare", lat: -18.9707, lng: 32.6709 },
  { id: 6, name: "Gweru Mall", area: "Gweru", lat: -19.4500, lng: 29.8167 },
  { id: 7, name: "Masvingo Center", area: "Masvingo", lat: -20.0667, lng: 30.8333 },
  { id: 8, name: "Chinhoyi Center", area: "Chinhoyi", lat: -17.3667, lng: 30.2000 },
  { id: 9, name: "Victoria Falls", area: "Victoria Falls", lat: -17.9318, lng: 25.8307 },
  { id: 10, name: "Kwekwe CBD", area: "Kwekwe", lat: -18.9281, lng: 29.8149 },
  { id: 11, name: "Bindura Center", area: "Bindura", lat: -17.3019, lng: 31.3306 },
  { id: 12, name: "Marondera Center", area: "Marondera", lat: -18.1853, lng: 31.5519 },
  { id: 13, name: "Beitbridge Border", area: "Beitbridge", lat: -22.2167, lng: 30.0000 },
];

function SetViewOnLocation({ location }) {
  const map = useMap();
  if (location) {
    map.setView([location.lat, location.lng], 15);
  }
  return null;
}

function SearchMap() {
  const [search, setSearch] = useState("");
  const [foundSpot, setFoundSpot] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [location, setLocation] = useState(null);
  const [debugMatch, setDebugMatch] = useState([]);

  // Get unique areas for dropdown
  const uniqueAreas = Array.from(new Set(mockSpots.map(s => s.area)));

  const handleSearch = (e) => {
    e.preventDefault();
    setNotFound(false);
    setFoundSpot(null);
    const searchVal = search.trim().toLowerCase();
    console.log('Search input:', searchVal);
    console.log('Available spots:', mockSpots.map(s => s.area + ' / ' + s.name));
    const matches = mockSpots.filter(
      s => s.area.toLowerCase().includes(searchVal) || s.name.toLowerCase().includes(searchVal)
    );
    console.log('Matched spots:', matches);
    setDebugMatch(matches);
    if (matches.length > 0) {
      setFoundSpot(matches[0]);
      setLocation({ lat: matches[0].lat, lng: matches[0].lng });
    } else {
      setNotFound(true);
      setLocation(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '2em' }}>
      <div style={{ fontSize: '2em', fontWeight: 700, color: '#ef4444', marginBottom: '0.5em', letterSpacing: '2px', textTransform: 'uppercase' }}>
        SEARCH MAP PAGE
      </div>
      <h2 style={{ color: '#2563eb', marginBottom: '1em' }}>Find Parking Near Me</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1em', marginBottom: '1.5em', alignItems: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter area or place name..."
          style={{ padding: '0.7em 1em', borderRadius: 8, border: '1px solid #ccc', fontSize: '1.08em', width: 220 }}
        />
        <select
          value={search}
          onChange={e => { setSearch(e.target.value); setTimeout(() => handleSearch({ preventDefault: () => {} }), 0); }}
          style={{ padding: '0.7em 1em', borderRadius: 8, border: '1px solid #ccc', fontSize: '1.08em' }}
        >
          <option value="">Select area...</option>
          {uniqueAreas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
        <button type="submit" className="primary-btn animated-btn" style={{ minWidth: 120, fontSize: '1.08em', padding: '0.7em 1.5em', borderRadius: '0.7em', fontWeight: 600, background: '#2563eb', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(30,40,60,0.08)', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
          Search
        </button>
      </form>
      <div style={{ color: '#2563eb', fontSize: '0.98em', marginBottom: '1em' }}>
        <b>All unique areas:</b> {uniqueAreas.join(', ')}
      </div>
      {search && (
        <div style={{ color: '#888', fontSize: '0.98em', marginBottom: '1em' }}>
          <b>Search input:</b> {search} <br />
          <b>Matched:</b> {debugMatch.length > 0 ? debugMatch.map(s => s.name + ' (' + s.area + ')').join(', ') : 'None'}
        </div>
      )}
      {search && (
        foundSpot ? (
          <div style={{ color: '#43cea2', fontWeight: 600, marginBottom: '1em' }}>
            Parking is available in <b>{foundSpot.area}</b>!
          </div>
        ) : notFound ? (
          <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '1em' }}>
            No parking available in <b>{search}</b>.
          </div>
        ) : null
      )}
      <div style={{ width: '90vw', maxWidth: 600, height: 400, margin: '0 auto', borderRadius: '1em', overflow: 'hidden', boxShadow: '0 2px 16px rgba(30,40,60,0.10)' }}>
        <MapContainer center={location || [0, 0]} zoom={location ? 15 : 2} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {foundSpot && (
            <Marker position={[foundSpot.lat, foundSpot.lng]}>
              <Popup>Parking available here!</Popup>
            </Marker>
          )}
          <SetViewOnLocation location={location} />
        </MapContainer>
      </div>
      {notFound && (
        <div style={{ color: '#ef4444', fontWeight: 500, marginTop: '1em' }}>No parking available in this area.</div>
      )}
      <style>{`
        .animated-btn:hover {
          transform: scale(1.07);
          box-shadow: 0 6px 24px rgba(30,40,60,0.18);
        }
      `}</style>
    </div>
  );
}

export default SearchMap; 