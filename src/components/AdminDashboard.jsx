import React, { useState } from 'react';

const AdminDashboard = ({ 
  showAdminAddCar, setShowAdminAddCar, 
  showAdminOrders, setShowAdminOrders, 
  handleAddCar, newCarForm, setNewCarForm,
  handleApplyDiscount 
}) => {
  
  const [discountBrand, setDiscountBrand] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');

  const onDiscountSubmit = (e) => {
    e.preventDefault();
    if (!discountBrand || !discountPercentage) return;
    
    handleApplyDiscount(discountBrand, discountPercentage);
    
    setDiscountBrand('');
    setDiscountPercentage('');
  };

  return (
    <>
      <div style={styles.buttonContainer}>
        <button 
          onClick={() => setShowAdminAddCar(!showAdminAddCar)} 
          style={showAdminAddCar ? styles.whiteBtn : styles.outlineBtn}
        >
          {showAdminAddCar ? 'סגור טופס הוספה' : 'הוספת רכב למלאי'}
        </button>
        <button 
          onClick={() => setShowAdminOrders(!showAdminOrders)} 
          style={showAdminOrders ? styles.whiteBtn : styles.outlineBtn}
        >
          {showAdminOrders ? 'סגור לוח פניות' : 'ניהול פניות והזמנות'}
        </button>
      </div>

      {showAdminAddCar && (
        <section style={styles.addCarSection}>
          <h2 style={styles.sectionTitle}>הוספת דגם חדש לקטלוג</h2>
          <form onSubmit={handleAddCar} style={styles.addCarForm}>
            <input 
              type="text" 
              placeholder="יצרן (למשל: Hyundai)" 
              value={newCarForm.brand} 
              onChange={(e) => setNewCarForm({...newCarForm, brand: e.target.value})} 
              required 
              style={styles.formInput} 
            />
            <input 
              type="text" 
              placeholder="דגם" 
              value={newCarForm.model} 
              onChange={(e) => setNewCarForm({...newCarForm, model: e.target.value})} 
              required 
              style={styles.formInput} 
            />
            <input 
              type="number" 
              placeholder="שנת ייצור" 
              value={newCarForm.productionYear} 
              onChange={(e) => setNewCarForm({...newCarForm, productionYear: e.target.value})} 
              required 
              style={styles.formInput} 
            />
            <input 
              type="number" 
              placeholder="מחיר (₪)" 
              value={newCarForm.price} 
              onChange={(e) => setNewCarForm({...newCarForm, price: e.target.value})} 
              required 
              style={styles.formInput} 
            />
            <input 
              type="text" 
              placeholder="נתיב תמונה (ב-public)" 
              value={newCarForm.imageFile} 
              onChange={(e) => setNewCarForm({...newCarForm, imageFile: e.target.value})} 
              style={styles.formInput} 
            />
            <button type="submit" style={styles.submitBtn}>אישור והוספה למלאי</button>
          </form>
        </section>
      )}

      <section style={styles.addCarSection}>
        <h2 style={styles.sectionTitle}>מבצעים קבוצתיים והנחות יצרן</h2>
        <form onSubmit={onDiscountSubmit} style={styles.addCarForm}>
          <input 
            type="text" 
            placeholder="שם היצרן להנחה (למשל: Hyundai)" 
            value={discountBrand} 
            onChange={(e) => setDiscountBrand(e.target.value)} 
            required 
            style={styles.formInput} 
          />
          <input 
            type="number" 
            placeholder="אחוז ההנחה (למשל: 10)" 
            value={discountPercentage} 
            onChange={(e) => setDiscountPercentage(e.target.value)} 
            min="1"
            max="100"
            required 
            style={styles.formInput} 
          />
          <button type="submit" style={styles.discountBtn}>עדכן מחירים בשרת</button>
        </form>
      </section>
    </>
  );
};

const styles = {
  buttonContainer: { display: 'flex', gap: '15px', marginBottom: '30px', direction: 'rtl' },
  whiteBtn: { background: '#ffffff', color: '#000000', border: '1px solid #ffffff', padding: '12px 20px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s ease' },
  outlineBtn: { background: 'transparent', color: '#000000', border: '1px solid #000000', padding: '12px 20px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s ease' },
  addCarSection: { border: '1px solid #222222', padding: '25px', marginBottom: '30px', backgroundColor: '#121212', textAlign: 'right' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '25px', color: '#ffffff', letterSpacing: '0.5px' },
  addCarForm: { display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end', direction: 'rtl' },
  formInput: { padding: '12px', border: '1px solid #333333', fontSize: '14px', flex: '1', minWidth: '180px', boxSizing: 'border-box', backgroundColor: '#050505', color: '#ffffff', outline: 'none' },
  submitBtn: { background: '#ffffff', color: '#000000', border: '1px solid #ffffff', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' },
  discountBtn: { background: '#d9534f', color: '#ffffff', border: '1px solid #d9534f', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' }
};

export default AdminDashboard;