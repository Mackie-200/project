import React from "react";

function LotsList({
  lots,
  editLotId,
  setEditLotId,
  editLotName,
  setEditLotName,
  editLotDescription,
  setEditLotDescription,
  editLot,
  deleteLot,
  toast
}) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>All Parking Lots</h3>
      <ul>
        {lots.length === 0 ? (
          <li>No lots found.</li>
        ) : (
          lots.map((lot) => (
            <li key={lot.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {editLotId === lot.id ? (
                <>
                  <input
                    type="text"
                    value={editLotName}
                    onChange={e => setEditLotName(e.target.value)}
                    placeholder="Lot Name"
                    style={{ marginRight: 8 }}
                  />
                  <input
                    type="text"
                    value={editLotDescription}
                    onChange={e => setEditLotDescription(e.target.value)}
                    placeholder="Description"
                    style={{ marginRight: 8 }}
                  />
                  <div style={{ display: 'flex', gap: '0.5em' }}>
                    <button
                      onClick={() => {
                        if (!editLotName || !editLotDescription) return;
                        editLot(lot.id, { name: editLotName, description: editLotDescription });
                        setEditLotId(null);
                        setEditLotName("");
                        setEditLotDescription("");
                        toast.success("Lot updated!");
                      }}
                      style={{ marginRight: 4 }}
                    >Save</button>
                    <button onClick={() => { setEditLotId(null); setEditLotName(""); setEditLotDescription(""); }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span><strong>{lot.name}</strong>: {lot.description}</span>
                  <div style={{ display: 'flex', gap: '0.5em', marginLeft: 'auto' }}>
                    <button onClick={() => { setEditLotId(lot.id); setEditLotName(lot.name); setEditLotDescription(lot.description); }}>Edit</button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this lot?")) {
                          deleteLot(lot.id);
                          toast.success("Lot deleted!");
                        }
                      }}
                      style={{ color: 'red' }}
                    >Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default LotsList; 