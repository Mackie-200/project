import React from "react";

function LotAnalytics({ lots, spaces, bookings, payments }) {
  // Helper: get spaces for a lot
  const getSpacesForLot = (lotId) => spaces.filter(s => s.lotId === lotId || s.lot_id === lotId);
  
  const getBookingsForSpace = (spaceId) => bookings.filter(b => b.space_id === spaceId || b.spaceId === spaceId);
  
  const getPaymentsForBooking = (bookingId) => payments.filter(p => p.reservation_id === bookingId);

  return (
    <section style={{ marginTop: "2rem", marginBottom: "2rem", background: "#f7fafd", border: "1px solid #b6e0fe", borderRadius: 8, padding: 16 }}>
      <h3>Parking Lot Analytics</h3>
      <ul style={{ textAlign: 'center', padding: 0 }}>
        {lots.length === 0 ? (
          <li>No lots found.</li>
        ) : (
          lots.map(lot => {
            const lotSpaces = getSpacesForLot(lot.id);
            const totalSpaces = lotSpaces.length;
            const occupiedSpaces = lotSpaces.filter(s => !s.is_available).length;
            const occupancyRate = totalSpaces > 0 ? ((occupiedSpaces / totalSpaces) * 100).toFixed(1) : 0;
            let lotRevenue = 0;
            let spaceUsage = lotSpaces.map(space => {
              const spaceBookings = getBookingsForSpace(space.id);
              const spaceRevenue = spaceBookings.reduce((sum, b) => {
                const pay = getPaymentsForBooking(b.id);
                return sum + pay.reduce((pSum, p) => pSum + (p.amount || 0), 0);
              }, 0);
              lotRevenue += spaceRevenue;
              return { space, count: spaceBookings.length };
            });
            // Most/least used space
            const mostUsed = spaceUsage.reduce((max, curr) => curr.count > (max?.count || 0) ? curr : max, null);
            const leastUsed = spaceUsage.reduce((min, curr) => curr.count < (min?.count ?? Infinity) ? curr : min, null);
            return (
              <li key={lot.id} style={{ marginBottom: 32, padding: 16, borderBottom: "1px solid #e0e0e0", borderRadius: 12, background: '#fff', boxShadow: '0 2px 8px rgba(30,40,60,0.06)' }}>
                <div style={{ fontWeight: 700, fontSize: '1.2em', marginBottom: 8 }}>{lot.name} <span style={{ color: '#888', fontWeight: 400 }}>({lot.location})</span></div>
                <div style={{ marginBottom: 8 }}>Spaces: <b>{totalSpaces}</b> | Occupied: <b>{occupiedSpaces}</b> | Occupancy Rate: <b>{occupancyRate}%</b></div>
                <div style={{ marginBottom: 8 }}>Revenue: <b>${lotRevenue.toFixed(2)}</b></div>
                <div style={{ marginBottom: 8 }}>Most Used Space: <b>{mostUsed ? `${mostUsed.space.space_number || mostUsed.space.name} (${mostUsed.count} bookings)` : "N/A"}</b></div>
                <div>Least Used Space: <b>{leastUsed ? `${leastUsed.space.space_number || leastUsed.space.name} (${leastUsed.count} bookings)` : "N/A"}</b></div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default LotAnalytics; 