import React from 'react';

const OrdersTable = ({ 
  user, 
  displayedOrders, 
  editingOrderId, 
  setEditingOrderId, 
  editForm, 
  setEditForm, 
  handleUpdateOrder, 
  startEdit, 
  handleDeleteOrder,
  searchTerm, setSearchTerm,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice
}) => {

  return (
    <section style={styles.ordersSection}>
      <div style={styles.ordersHeader}>
        <h2 style={styles.sectionTitle}>
          {user.role === 'admin' ? 'לוח ניהול פניות והזמנות' : 'היסטוריית פניות ורכישות'}
        </h2>
        <span style={styles.orderBadgeCount}>{displayedOrders.length} רשומות נמצאו</span>
      </div>

      {/* אזור סינונים וחיפוש */}
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>חיפוש חופשי (שם / טלפון / דגם)</label>
          <input 
            type="text" 
            placeholder="הקלד לחיפוש..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={styles.filterInput}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>מחיר מינימלי (₪)</label>
          <input 
            type="number" 
            placeholder="ממחיר..." 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
            style={styles.filterInput}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>מחיר מקסימלי (₪)</label>
          <input 
            type="number" 
            placeholder="עד מחיר..." 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            style={styles.filterInput}
          />
        </div>
        {(searchTerm || minPrice || maxPrice) && (
          <button 
            onClick={() => { setSearchTerm(''); setMinPrice(''); setMaxPrice(''); }} 
            style={styles.clearFilterBtn}
          >
            איפוס סינונים
          </button>
        )}
      </div>
      
      {displayedOrders.length === 0 ? (
        <p style={styles.noOrdersText}>אין נתונים להצגה במערכת.</p>
      ) : (
        <div style={{ overflowX: 'auto', textAlign: 'right' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>שם הלקוח</th>
                <th style={styles.th}>טלפון ליצירת קשר</th>
                <th style={styles.th}>פרטי הדגם</th>
                <th style={styles.th}>סך הכל</th>
                {user.role === 'admin' && <th style={{ ...styles.th, textAlign: 'center' }}>פעולות מערכת</th>}
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.id} style={styles.tableRow}>
                  {editingOrderId === order.id && user.role === 'admin' ? (
                    <>
                      <td style={styles.td}><input type="text" style={styles.editInput} value={editForm.customerName} onChange={(e) => setEditForm({...editForm, customerName: e.target.value})} /></td>
                      <td style={styles.td}><input type="text" style={styles.editInput} value={editForm.customerPhone} onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})} /></td>
                      <td style={styles.td}><input type="text" style={styles.editInput} value={editForm.carBrandAndModel} onChange={(e) => setEditForm({...editForm, carBrandAndModel: e.target.value})} /></td>
                      <td style={styles.td}><input type="number" style={styles.editInput} value={editForm.finalPrice} onChange={(e) => setEditForm({...editForm, finalPrice: Number(e.target.value)})} /></td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button onClick={() => handleUpdateOrder(order.id)} style={styles.saveBtn}>שמור</button>
                        <button onClick={() => setEditingOrderId(null)} style={styles.cancelBtn}>ביטול</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={styles.td}>{order.customerName}</td>
                      <td style={styles.td}>{order.customerPhone}</td>
                      <td style={styles.td}><span style={styles.carTag}>{order.carBrandAndModel}</span></td>
                      <td style={styles.priceTd}>
                        {order.finalPrice ? order.finalPrice.toLocaleString() : 0} ₪
                      </td>
                      {user.role === 'admin' && (
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <button onClick={() => startEdit(order)} style={styles.actionEditBtn}>ערוך</button>
                          <button onClick={() => handleDeleteOrder(order.id)} style={styles.actionDeleteBtn}>מחק</button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const styles = {
  ordersSection: { 
    border: '1px solid #e5e5e5', 
    padding: '25px', 
    backgroundColor: '#ffffff', 
    marginTop: '30px', 
    direction: 'rtl' 
  },
  ordersHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '25px', 
    direction: 'rtl' 
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#000000',
    letterSpacing: '0.5px',
    margin: 0
  },
  orderBadgeCount: { 
    fontSize: '13px', 
    fontWeight: '600',
    color: '#232222ff',
    borderBottom: '1px solid #000000',
    paddingBottom: '2px'
  },
  filterContainer: { 
    display: 'flex', 
    gap: '15px', 
    flexWrap: 'wrap', 
    background: '#fafafa', 
    padding: '20px', 
    marginBottom: '25px', 
    border: '1px solid #e5e5e5', 
    alignItems: 'flex-end', 
    direction: 'rtl' 
  },
  filterGroup: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px', 
    flex: '1', 
    minWidth: '180px', 
    textAlign: 'right' 
  },
  filterLabel: { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#333333', 
    textAlign: 'right' 
  },
  filterInput: { 
    padding: '10px 12px', 
    border: '1px solid #ccc', 
    fontSize: '13px', 
    borderRadius: '0px',
    backgroundColor: '#ffffff',
    color: '#000000',
    textAlign: 'right', 
    direction: 'rtl',
    boxSizing: 'border-box'
  },
  clearFilterBtn: { 
    background: 'transparent', 
    color: '#000000', 
    border: '1px solid #000000', 
    padding: '10px 15px', 
    borderRadius: '0px',
    cursor: 'pointer', 
    fontWeight: '600', 
    fontSize: '12px', 
    height: '38px',
    letterSpacing: '0.5px'
  },
  noOrdersText: { 
    textAlign: 'center', 
    color: '#777777', 
    margin: '40px 0',
    fontSize: '14px' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '10px', 
    direction: 'rtl' 
  },
  thRow: {
    borderBottom: '2px solid #000000'
  },
  th: { 
    padding: '14px 12px', 
    textAlign: 'right', 
    background: '#ffffff', 
    color: '#000000',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #e5e5e5',
    backgroundColor: '#ffffff'
  },
  td: { 
    padding: '14px 12px', 
    verticalAlign: 'middle', 
    textAlign: 'right',
    fontSize: '14px',
    color: '#333333'
  },
  priceTd: {
    padding: '14px 12px', 
    verticalAlign: 'middle', 
    textAlign: 'right',
    fontSize: '14px',
    color: '#000000', 
    fontWeight: '700'
  },
  carTag: { 
    fontWeight: '600',
    color: '#000000'
  },
  editInput: { 
    width: '100%', 
    padding: '8px', 
    borderRadius: '0px', 
    border: '1px solid #000000', 
    textAlign: 'right' 
  },
  actionEditBtn: { 
    background: 'transparent', 
    color: '#000000', 
    border: '1px solid #000000', 
    padding: '6px 12px', 
    marginLeft: '8px', 
    borderRadius: '0px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '12px'
  },
  actionDeleteBtn: { 
    background: '#000000', 
    color: '#ffffff', 
    border: '1px solid #000000', 
    padding: '6px 12px', 
    borderRadius: '0px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '12px'
  },
  saveBtn: { 
    background: '#000000', 
    color: '#ffffff', 
    border: '1px solid #000000', 
    padding: '6px 12px', 
    marginLeft: '5px', 
    borderRadius: '0px', 
    cursor: 'pointer', 
    fontWeight: '600' 
  },
  cancelBtn: { 
    background: 'transparent', 
    color: '#555555', 
    border: '1px solid #ccc', 
    padding: '6px 12px', 
    borderRadius: '0px', 
    cursor: 'pointer' 
  }
};

export default OrdersTable;