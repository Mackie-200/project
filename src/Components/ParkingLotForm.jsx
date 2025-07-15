import React, { useState } from "react";

const ParkingLotForm = ({ onAddLot, currentUser }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) return;
    onAddLot({
      name,
      description,
      host_id: currentUser?.name || "unknown",
    });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="parking-lot-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400, margin: '0 auto', alignItems: 'center' }}>
      <h3 style={{ marginBottom: '1.2em', textAlign: 'center', width: '100%' }}>Add Parking Lot</h3>
      <label htmlFor="lot-name" style={{ marginBottom: 4, fontWeight: 500, textAlign: 'center', width: '100%' }}>Lot Name</label>
      <input
        id="lot-name"
        type="text"
        placeholder="Lot Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ padding: '0.7em 1em', width: '100%' }}
      />
      <label htmlFor="lot-description" style={{ marginBottom: 4, fontWeight: 500, textAlign: 'center', width: '100%' }}>Description</label>
      <textarea
        id="lot-description"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        rows={3}
        style={{ padding: '0.7em 1em', width: '100%' }}
      />
      <button type="submit">Add Lot</button>
    </form>
  );
};

export default ParkingLotForm; 