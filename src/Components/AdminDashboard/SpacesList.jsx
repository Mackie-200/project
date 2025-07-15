import React from "react";

function SpacesList({
  spaces,
  spaceSearch,
  setSpaceSearch,
  spaceOwnerFilter,
  setSpaceOwnerFilter,
  uniqueOwners,
  editSpaceId,
  setEditSpaceId,
  editSpaceFields,
  setEditSpaceFields,
  editParkingSpace,
  deleteParkingSpace,
  toast
}) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>All Parking Spaces</h3>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <input
          type="text"
          placeholder="Search by name or location or owner..."
          value={spaceSearch}
          onChange={(e) => setSpaceSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={spaceOwnerFilter}
          onChange={(e) => setSpaceOwnerFilter(e.target.value)}
          style={{ minWidth: "120px" }}
        >
          <option value="">All Owners</option>
          {uniqueOwners.map((owner, idx) => (
            <option key={idx} value={owner}>{owner}</option>
          ))}
        </select>
      </div>
      <ul>
        {spaces.length === 0 ? (
          <li>No spaces found.</li>
        ) : (
          spaces.map((space) => (
            <li key={space.id} style={{ marginBottom: 8 }}>
              {editSpaceId === space.id ? (
                <>
                  <input
                    type="text"
                    value={editSpaceFields.space_number || ""}
                    onChange={e => setEditSpaceFields(f => ({ ...f, space_number: e.target.value }))}
                    placeholder="Space Number"
                    style={{ width: 60, marginRight: 8 }}
                  />
                  <select
                    value={editSpaceFields.space_type || "regular"}
                    onChange={e => setEditSpaceFields(f => ({ ...f, space_type: e.target.value }))}
                    style={{ marginRight: 8 }}
                  >
                    <option value="regular">regular</option>
                    <option value="compact">compact</option>
                    <option value="EV">EV</option>
                    <option value="accessible">accessible</option>
                  </select>
                  <select
                    value={editSpaceFields.is_available ? "true" : "false"}
                    onChange={e => setEditSpaceFields(f => ({ ...f, is_available: e.target.value === "true" }))}
                    style={{ marginRight: 8 }}
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                  <input
                    type="number"
                    value={editSpaceFields.rate_per_hour || ""}
                    onChange={e => setEditSpaceFields(f => ({ ...f, rate_per_hour: e.target.value }))}
                    placeholder="Rate/hr"
                    style={{ width: 80, marginRight: 8 }}
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={() => {
                      editParkingSpace(space.id, {
                        ...editSpaceFields,
                        rate_per_hour: parseFloat(editSpaceFields.rate_per_hour),
                      });
                      setEditSpaceId(null);
                      setEditSpaceFields({});
                      toast.success("Space updated!");
                    }}
                    style={{ marginRight: 4 }}
                  >Save</button>
                  <button onClick={() => { setEditSpaceId(null); setEditSpaceFields({}); }}>Cancel</button>
                </>
              ) : (
                <>
                  <span>
                    Space #{space.space_number || space.name} ({space.space_type || "regular"}) - {space.is_available ? 'Available' : 'Unavailable'} - ${space.rate_per_hour || 0}/hr
                  </span>
                  <button onClick={() => { setEditSpaceId(space.id); setEditSpaceFields({
                    space_number: space.space_number,
                    space_type: space.space_type,
                    is_available: space.is_available,
                    rate_per_hour: space.rate_per_hour,
                  }); }} style={{ marginLeft: 8 }}>Edit</button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this space?")) {
                        deleteParkingSpace(space.id);
                        toast.success("Space deleted!");
                      }
                    }}
                    style={{ marginLeft: 4, color: 'red' }}
                  >Delete</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default SpacesList; 