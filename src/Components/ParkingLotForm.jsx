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
    <form onSubmit={handleSubmit} className="parking-lot-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
      <h3>Add Parking Lot</h3>
      <input
        type="text"
        placeholder="Lot Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        rows={3}
      />
      <button type="submit">Add Lot</button>
    </form>
  );
};

export default ParkingLotForm; 