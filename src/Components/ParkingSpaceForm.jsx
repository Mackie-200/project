import React, { useState } from "react";

const spaceTypes = ["regular", "compact", "EV", "accessible"];

const ParkingSpaceForm = ({ lots, onAddSpace }) => {
  const [lotId, setLotId] = useState(lots.length > 0 ? lots[0].id : "");
  const [spaceNumber, setSpaceNumber] = useState("");
  const [spaceType, setSpaceType] = useState(spaceTypes[0]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [ratePerHour, setRatePerHour] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lotId || !spaceNumber || !spaceType || !ratePerHour) return;
    onAddSpace({
      lot_id: lotId,
      space_number: spaceNumber,
      space_type: spaceType,
      is_available: isAvailable,
      rate_per_hour: parseFloat(ratePerHour),
    });
    setSpaceNumber("");
    setSpaceType(spaceTypes[0]);
    setIsAvailable(true);
    setRatePerHour("");
  };

  if (lots.length === 0) {
    return (
      <div style={{ color: '#b00', margin: '1rem 0', fontWeight: 500 }}>
        You need to add a parking lot before you can add spaces.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="parking-space-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400, margin: '0 auto', alignItems: 'center' }}>
      <h3 style={{ textAlign: 'center', width: '100%' }}>Add Parking Space</h3>
      <label style={{ width: '100%', textAlign: 'center', fontWeight: 500 }}>
        Lot:
        <select value={lotId} onChange={e => setLotId(e.target.value)} required style={{ width: '100%', marginTop: 4, padding: '0.7em 1em' }}>
          {lots.map(lot => (
            <option key={lot.id} value={lot.id}>{lot.name}</option>
          ))}
        </select>
      </label>
      <input
        type="text"
        placeholder="Space Number"
        value={spaceNumber}
        onChange={e => setSpaceNumber(e.target.value)}
        required
        style={{ width: '100%', padding: '0.7em 1em', textAlign: 'center' }}
      />
      <label style={{ width: '100%', textAlign: 'center', fontWeight: 500 }}>
        Type:
        <select value={spaceType} onChange={e => setSpaceType(e.target.value)} required style={{ width: '100%', marginTop: 4, padding: '0.7em 1em' }}>
          {spaceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label style={{ width: '100%', textAlign: 'center', fontWeight: 500 }}>
        Available:
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={e => setIsAvailable(e.target.checked)}
          style={{ marginLeft: 8 }}
        />
      </label>
      <input
        type="number"
        placeholder="Rate per hour"
        value={ratePerHour}
        onChange={e => setRatePerHour(e.target.value)}
        min="0"
        step="0.01"
        required
        style={{ width: '100%', padding: '0.7em 1em', textAlign: 'center' }}
      />
      <button type="submit" style={{ width: '100%' }}>Add Space</button>
    </form>
  );
};

export default ParkingSpaceForm; 