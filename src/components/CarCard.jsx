import React, { useState } from 'react';

const CarCard = ({ car, user, handleAddToCart, setSelectedCar, handleUpdateCar, handleDeleteCar }) => {
  // תמונת ברירת מחדל של רכב שחור ויוקרתי במידה והתמונה לא קיימת במלאי
  const defaultBlackCarImg = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
  const carImageSrc = car.imageFile ? `/${car.imageFile}` : defaultBlackCarImg;

  // סטייט מקומי לניהול עריכת הרכב הנוכחי (למנהל)
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    brand: car.brand,
    model: car.model,
    productionYear: car.productionYear,
    price: car.price,
    imageFile: car.imageFile || ''
  });

  const onSave = (e) => {
    e.preventDefault();
    handleUpdateCar(car.id, editForm);
    setIsEditing(false);
  };

  return (
    <div className="car-card" style={styles.carCard}>
      {isEditing && user?.role === 'admin' ? (
        /* 📝 טופס עריכת רכב מעוצב למנהל בסגנון שחור-לבן נקי */
        <form onSubmit={onSave} style={styles.editForm}>
          <h4 style={styles.editTitle}>עריכת פרטי רכב</h4>
          <input type="text" placeholder="יצרן" value={editForm.brand} onChange={(e) => setEditForm({...editForm, brand: e.target.value})} style={styles.editInput} required />
          <input type="text" placeholder="דגם" value={editForm.model} onChange={(e) => setEditForm({...editForm, model: e.target.value})} style={styles.editInput} required />
          <input type="number" placeholder="שנת ייצור" value={editForm.productionYear} onChange={(e) => setEditForm({...editForm, productionYear: Number(e.target.value)})} style={styles.editInput} required />
          <input type="number" placeholder="מחיר" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})} style={styles.editInput} required />
          <input type="text" placeholder="שם קובץ תמונה" value={editForm.imageFile} onChange={(e) => setEditForm({...editForm, imageFile: e.target.value})} style={styles.editInput} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button type="submit" style={styles.saveBtn}>שמור </button>
            <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>ביטול</button>
          </div>
        </form>
      ) : (
        /* 🚗 תצוגת הרכב הרגילה והיוקרתית */
        <>
          <div style={styles.imageWrapper}>
            <img 
              src={carImageSrc} 
              alt={`${car.brand} ${car.model}`} 
              style={styles.cardImg} 
              onClick={() => setSelectedCar(car)} 
              onError={(e) => { e.target.src = defaultBlackCarImg; }} 
            />
            <div style={styles.carBadge}>{car.productionYear}</div>
          </div>
          
          <div style={styles.infoContent}>
            <h3 style={styles.carTitle}>
              {car.brand} <span style={styles.carModel}>{car.model}</span>
            </h3>
            
            <p style={styles.carPrice}>
              {car.price ? car.price.toLocaleString() : 0} ₪
            </p>
            
            {user && user.role === 'user' && (
              <button onClick={() => handleAddToCart(car)} style={styles.orderBtn}>
                הוספה להזמנה
              </button>
            )}

            {/* 👑 כפתורי ניהול מלאי למנהל בלבד */}
            {user && user.role === 'admin' && (
              <div style={styles.adminActions}>
                <button onClick={() => setIsEditing(true)} style={styles.adminEditBtn}>ערוך רכב </button>
                <button onClick={() => handleDeleteCar(car.id)} style={styles.adminDeleteBtn}>מחק מהמלאי</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  carCard: { 
    background: '#0f0f0f', 
    padding: '10px', 
    border: '2px solid #1a1a1a', 
    position: 'relative', 
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    minHeight: '260px' // הגבהה קלה כדי להכיל את כפתורי הניהול בצורה מרווחת
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '105px', 
    backgroundColor: '#000000',
    overflow: 'hidden',
    borderBottom: '2px solid #1a1a1a'
  },
  cardImg: { 
    cursor: 'pointer', 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover'
  },
  carBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    background: '#ffffff',
    color: '#000000',
    fontSize: '11px',
    fontWeight: '800',
    padding: '2px 6px',
    letterSpacing: '0.5px'
  },
  infoContent: {
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  carTitle: {
    fontSize: '13px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  carModel: {
    display: 'block',
    color: '#a0a0a0',
    fontWeight: '400',
    fontSize: '11px',
    marginTop: '2px'
  },
  carPrice: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '8px 0 12px 0'
  },
  orderBtn: { 
    width: '100%', 
    background: 'transparent', 
    color: '#ffffff', 
    border: '1px solid #333333', 
    padding: '8px 0', 
    borderRadius: '0px', 
    fontWeight: '700', 
    fontSize: '11px',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease'
  },
  
  // עיצוב ייחודי למנהל
  adminActions: { display: 'flex', gap: '5px', marginTop: '8px', borderTop: '1px solid #1a1a1a', paddingTop: '8px' },
  adminEditBtn: { flex: 1, background: '#ffffff', color: '#000000', border: 'none', padding: '6px 0', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  adminDeleteBtn: { flex: 1, background: 'transparent', color: '#000000ff', border: '1px solid #090909ff', padding: '5px 0', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  
  // עיצוב טופס העריכה הפנימי
  editForm: { display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', justifyContent: 'center' },
  editTitle: { margin: '0 0 4px 0', color: '#ffffff', fontSize: '12px', fontWeight: '700' },
  editInput: { padding: '5px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '11px', textAlign: 'right' },
  saveBtn: { flex: 1, background: '#ffffff', color: '#000000', border: 'none', padding: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'transparent', color: '#888', border: '1px solid #333', padding: '5px', fontSize: '11px', cursor: 'pointer' }
};

export default CarCard;