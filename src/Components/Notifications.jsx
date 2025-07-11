import React from "react";
import { useNotifications } from "../Context/NotificationContext";

function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, minWidth: 300 }}>
      <div style={{ background: '#fff', border: '1px solid #b6e0fe', borderRadius: 8, boxShadow: '0 2px 8px #0002', padding: 12 }}>
        <h4 style={{ margin: 0, marginBottom: 8 }}>Notifications</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notifications.map(n => (
            <li key={n.id} style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>
              <div>{n.message}</div>
              <button onClick={() => removeNotification(n.id)} style={{ fontSize: 12, color: '#b22222', background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notifications; 