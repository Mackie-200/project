import React from "react";

function PaymentsList({
  payments,
  bookings,
  getUserById,
  setPayments,
  toast
}) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>All Payments</h3>
      <ul>
        {payments.length === 0 ? (
          <li>No payments found.</li>
        ) : (
          payments.map((payment) => {
            const booking = bookings.find(b => b.id === payment.reservation_id);
            const userObj = booking ? getUserById(booking.user_id) : null;
            return (
              <li key={payment.id} style={{ marginBottom: 8 }}>
                <strong>Reservation:</strong> {payment.reservation_id}
                {" | "}
                <strong>User:</strong> {userObj ? (userObj.name || userObj.username || userObj.email) : "Unknown"}
                {" | "}
                <strong>Amount:</strong> ${payment.amount}
                {" | "}
                <strong>Method:</strong> {payment.method}
                {" | "}
                <strong>Paid at:</strong> {new Date(payment.paid_at).toLocaleString()}
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this payment?")) {
                      setPayments(prev => prev.filter(p => p.id !== payment.id));
                      toast.success("Payment deleted!");
                    }
                  }}
                  style={{ marginLeft: 8, color: 'red' }}
                >Delete</button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default PaymentsList; 