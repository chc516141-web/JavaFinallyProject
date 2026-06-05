import React, { useState } from 'react';

const OrderProgressBar = ({ currentStatus }) => {
  const steps = ['ההזמנה אושרה', 'נשלח', 'נקודת איסוף', 'נמסר'];
  const activeIndex = steps.indexOf(currentStatus);

  return (
    <div style={stepperStyles.container}>
      <div style={stepperStyles.timelineWrapper}>
        {steps.map((step, idx) => (
          <div key={idx} style={stepperStyles.stepWrapper}>
            {idx > 0 && <div style={{...stepperStyles.line, backgroundColor: idx <= activeIndex ? '#222' : '#ccc'}} />}
            <div style={{...stepperStyles.circle, backgroundColor: idx <= activeIndex ? '#222' : '#fff', border: '1px solid #222'}} />
            <span style={{...stepperStyles.label, fontWeight: idx === activeIndex ? 'bold' : 'normal'}}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrdersTable = ({ user, displayedOrders, handleDeleteOrder, handleUpdateOrderStatus }) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  return (
    <section style={styles.ordersSection}>
      <table style={styles.table}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={styles.th}>שם לקוח</th>
            <th style={styles.th}>טלפון</th>
            <th style={styles.th}>רכב</th>
            <th style={styles.th}>מחיר</th>
            <th style={styles.th}>סטטוס</th>
            {user.role === 'admin' && <th style={styles.th}>פעולות</th>}
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr 
                style={{...styles.tr, cursor: user.role !== 'admin' ? 'pointer' : 'default'}} 
                onClick={() => user.role !== 'admin' && setSelectedRowId(selectedRowId === order.id ? null : order.id)}
              >
                <td style={styles.td}>{order.customerName}</td>
                <td style={styles.td}>{order.customerPhone}</td>
                <td style={styles.td}>{order.carBrandAndModel}</td>
                <td style={styles.td}>{order.finalPrice.toLocaleString()} ₪</td>
                <td style={styles.td}>
                  {user.role === 'admin' ? (
                    <select value={order.status || 'ההזמנה אושרה'} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} style={styles.select}>
                      {['ההזמנה אושרה', 'נשלח', 'נקודת איסוף', 'נמסר'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{...styles.dot, backgroundColor: '#222'}} /> {order.status || 'ההזמנה אושרה'}
                    </div>
                  )}
                </td>
                {user.role === 'admin' && (
                  <td style={styles.td}>
                    <button onClick={() => handleDeleteOrder(order.id)} style={{...styles.delBtn, color: 'red'}}>מחק</button>
                    <button onClick={() => setSelectedRowId(selectedRowId === order.id ? null : order.id)} style={styles.viewBtn}>צפה בתהליך</button>
                  </td>
                )}
              </tr>
              {selectedRowId === order.id && (
                <tr><td colSpan={user.role === 'admin' ? 6 : 5}><OrderProgressBar currentStatus={order.status} /></td></tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const styles = {
  ordersSection: { padding: '20px', direction: 'rtl' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
  th: { padding: '12px', borderBottom: '2px solid #222', fontSize: '14px' },
  td: { padding: '12px', borderBottom: '1px solid #ddd', fontSize: '14px' },
  select: { padding: '5px', borderRadius: '0', border: '1px solid #222' },
  dot: { width: '10px', height: '10px', borderRadius: '50%' },
  delBtn: { background: '#fff', border: '1px solid #222', cursor: 'pointer', padding: '5px 10px', marginLeft: '5px' },
  viewBtn: { background: '#222', color: '#fff', border: 'none', cursor: 'pointer', padding: '5px 10px' }
};

const stepperStyles = {
  container: { padding: '20px', background: '#fafafa' },
  timelineWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stepWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  circle: { width: '12px', height: '12px', borderRadius: '50%' },
  line: { position: 'absolute', top: '5px', right: '50%', width: '100%', height: '1px', zIndex: -1 },
  label: { marginTop: '10px', fontSize: '12px' }
};

export default OrdersTable;