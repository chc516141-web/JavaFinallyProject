import React from 'react';

const UserProfile = ({ profileForm, setProfileForm, handleUpdateProfile, showUserOrders, setShowUserOrders }) => {
  return (
    <section style={styles.profileSection}>
      <h2 style={styles.sectionTitle}>אזור אישי ועדכון פרטים</h2>
      <form onSubmit={handleUpdateProfile} style={styles.formInline}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>שם מלא</label>
          <input 
            type="text" 
            value={profileForm.fullName} 
            onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} 
            required 
            style={styles.formInput} 
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>אימייל / שם משתמש</label>
          <input 
            type="email" 
            value={profileForm.username} 
            onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} 
            required 
            style={styles.formInput} 
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>מספר טלפון לקשר</label>
          <input 
            type="text" 
            value={profileForm.phone} 
            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
            required 
            style={styles.formInput} 
          />
        </div>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.blackBtn}>שמור שינויים</button>
          <button type="button" onClick={() => setShowUserOrders(!showUserOrders)} style={styles.outlineBtn}>
            {showUserOrders ? 'הסתר היסטוריית פניות' : 'היסטוריית פניות ורכישות'}
          </button>
        </div>
      </form>
    </section>
  );
};

const styles = {
  profileSection: { 
    border: '1px solid #e5e5e5', 
    padding: '25px', 
    marginBottom: '30px', 
    backgroundColor: '#ffffff',
    textAlign: 'right'
  },
  sectionTitle: {
    fontSize: '18px', 
    fontWeight: '700', 
    marginBottom: '20px',
    color: '#000000',
    letterSpacing: '0.5px'
  },
  formInline: { 
    display: 'flex', 
    gap: '15px', 
    flexWrap: 'wrap', 
    alignItems: 'flex-end' 
  },
  inputGroup: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '5px', 
    flex: 1, 
    minWidth: '200px' 
  },
  label: { 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#555555' 
  },
  formInput: { 
    padding: '10px', 
    border: '1px solid #ccc', 
    fontSize: '14px', 
    borderRadius: '0px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  buttonContainer: { 
    display: 'flex', 
    gap: '15px', 
    marginTop: '20px', 
    width: '100%' 
  },
  blackBtn: { 
    background: '#000000', 
    color: '#ffffff', 
    border: '1px solid #000000', 
    padding: '10px 20px', 
    fontSize: '13px', 
    fontWeight: '600', 
    letterSpacing: '0.5px', 
    cursor: 'pointer', 
    borderRadius: '0px',
    height: '42px'
  },
  outlineBtn: { 
    background: 'transparent', 
    color: '#000000', 
    border: '1px solid #000000', 
    padding: '10px 20px', 
    fontSize: '13px', 
    fontWeight: '600', 
    letterSpacing: '0.5px', 
    cursor: 'pointer', 
    borderRadius: '0px',
    height: '42px'
  }
};

export default UserProfile;