import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for better visibility
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


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
    <div className="search-map-container">
      <div className="search-map-header">
        SEARCH MAP PAGE
      </div>
      <h2 className="search-map-title">Find Parking Near Me</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter area or place name..."
            className="search-input"
          />
          <select
            value={search}
            onChange={e => { setSearch(e.target.value); setTimeout(() => handleSearch({ preventDefault: () => {} }), 0); }}
            className="search-select"
          >
            <option value="">Select area...</option>
            {uniqueAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="search-areas-info">
        <b>All unique areas:</b> {uniqueAreas.join(', ')}
      </div>
      {search && (
        <div className="search-debug-info">
          <b>Search input:</b> {search} <br />
          <b>Matched:</b> {debugMatch.length > 0 ? debugMatch.map(s => s.name + ' (' + s.area + ')').join(', ') : 'None'}
        </div>
      )}
      {search && (
        foundSpot ? (
          <div className="search-result success">
            Parking is available in <b>{foundSpot.area}</b>!
          </div>
        ) : notFound ? (
          <div className="search-result error">
            No parking available in <b>{search}</b>.
          </div>
        ) : null
      )}
      <div className="map-container">
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
          <MapContainer 
            center={[-17.8292, 31.0522]} 
            zoom={10} 
            style={{ height: '100%', width: '100%' }} 
            scrollWheelZoom={true}
            key="parking-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Show all parking spots as markers */}
            {mockSpots.map(spot => (
              <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={customIcon}>
                <Popup>
                  <div>
                    <h4>{spot.name}</h4>
                    <p>Area: {spot.area}</p>
                    <p>Parking available here!</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Highlight found spot with different styling if searched */}
            {foundSpot && (
              <Marker position={[foundSpot.lat, foundSpot.lng]} icon={customIcon}>
                <Popup>
                  <div style={{ color: '#166534', fontWeight: 'bold' }}>
                    <h4>🎯 {foundSpot.name}</h4>
                    <p>Area: {foundSpot.area}</p>
                    <p>✅ Parking available here!</p>
                  </div>
                </Popup>
              </Marker>
            )}
            {location && <SetViewOnLocation location={location} />}
          </MapContainer>
        </div>
      </div>
      {notFound && (
        <div style={{ color: '#ef4444', fontWeight: 500, marginTop: '1em' }}>No parking available in this area.</div>
      )}
      <style>{`
        /* Responsive SearchMap Container */
        .search-map-container {
          min-height: 100vh;
          width: 100%;
          max-width: 100vw;
          padding: 1rem;
          padding-top: 120px; /* Account for fixed navbar */
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          background: #f4f8fb;
          overflow: hidden;
        }

        /* Header Styles */
        .search-map-header {
          font-size: 1.5rem;
          font-weight: bold;
          color: #185a9d;
          text-align: center;
          margin-bottom: 1rem;
          letter-spacing: 1px;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        }

        .search-map-title {
          font-size: 1.5rem;
          color: #0d577a;
          text-align: center;
          margin: 0 0 1.5rem 0;
          font-weight: 700;
          background: linear-gradient(135deg, #185a9d, #0d577a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
        }

        /* Search Form */
        .search-form {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          margin-bottom: 1rem;
        }

        .search-inputs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-input,
        .search-select {
          flex: 1;
          min-width: 200px;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .search-input:focus,
        .search-select:focus {
          outline: none;
          border-color: #185a9d;
        }

        .search-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: #185a9d;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-button:hover {
          background: #0d577a;
          transform: translateY(-2px);
        }

        /* Info Sections */
        .search-areas-info,
        .search-debug-info {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          box-shadow: 0 1px 8px rgba(0,0,0,0.05);
        }

        .search-debug-info {
          background: #f8fafc;
          border-left: 4px solid #185a9d;
        }

        /* Search Results */
        .search-result {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 500;
          text-align: center;
        }

        .search-result.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .search-result.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        /* Map Container */
        .map-container {
          flex: 1;
          min-height: 500px;
          height: 500px;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .map-container .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          border-radius: 12px;
        }

        /* Tablet Styles */
        @media (max-width: 768px) {
          .search-map-container {
            padding: 0.75rem;
            padding-top: 100px; /* Reduced for tablet */
          }

          .search-map-header {
            font-size: 1.25rem;
            padding: 0.75rem;
          }

          .search-map-title {
            font-size: 1.2rem;
          }

          .search-form {
            padding: 1rem;
          }

          .search-inputs {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-input,
          .search-select {
            min-width: unset;
            width: 100%;
          }

          .map-container {
            min-height: 300px;
            height: calc(100vh - 350px);
            max-height: 400px;
          }

          .search-areas-info,
          .search-debug-info {
            font-size: 0.85rem;
            padding: 0.75rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 480px) {
          .search-map-container {
            padding: 0.5rem;
            padding-top: 90px; /* Reduced for mobile */
            min-height: 100vh;
          }

          .search-map-header {
            font-size: 1rem;
            margin-bottom: 0.5rem;
            padding: 0.5rem;
          }

          .search-map-title {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }

          .search-form {
            padding: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .search-input,
          .search-select,
          .search-button {
            padding: 0.6rem;
            font-size: 0.9rem;
          }

          .map-container {
            min-height: 250px;
            height: calc(100vh - 300px);
            max-height: 350px;
          }

          .search-areas-info,
          .search-debug-info {
            font-size: 0.8rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .search-result {
            padding: 0.75rem;
            font-size: 0.9rem;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .search-map-container {
            padding: 0.25rem;
          }

          .search-form {
            padding: 0.5rem;
          }

          .map-container {
            min-height: 200px;
            height: calc(100vh - 280px);
            max-height: 300px;
          }
        }

        .animated-btn:hover {
          transform: scale(1.07);
          box-shadow: 0 6px 24px rgba(30,40,60,0.18);
        }
      `}</style>
    </div>
  );
}

export default SearchMap; 