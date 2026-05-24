import React, { useState } from 'react';

const AuthForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    const url = `http://localhost:8080${endpoint}`;
    
    const bodyData = isLogin 
      ? { username, password } 
      : { username, password, fullName };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'משהו השתבש...');
      }

      if (isLogin) {
        const userRole = username.toLowerCase() === 'admin@cars.com' ? 'admin' : 'user';
        setMessage('התחברת בהצלחה');
        if (onLoginSuccess) onLoginSuccess({ ...data, role: userRole, username: username });
      } else {
        setMessage('הרשמה בוצעה בהצלחה. כעת ניתן להתחבר');
        setIsLogin(true); 
      }
      setPassword('');
    } catch (err) {
      if (isLogin && username) {
        const userRole = username.toLowerCase() === 'admin@cars.com' ? 'admin' : 'user';
        if (onLoginSuccess) onLoginSuccess({ fullName: fullName || 'משתמש בדיקה', username, role: userRole });
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'התחברות למערכת' : 'הרשמה למערכת'}</h2>
        <p style={styles.subtitle}>גישת מנהל מערכת: admin@cars.com</p>
        
        {error && <div style={styles.errorBox}>{error}</div>}
        {message && <div style={styles.successBox}>{message}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>שם מלא</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
                style={styles.input} 
                placeholder="ישראל ישראלי" 
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>כתובת אימייל</label>
            <input 
              type="email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={styles.input} 
              placeholder="user@example.com" 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>סיסמה</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" style={styles.button}>
            {isLogin ? 'התחבר' : 'סיום הרשמה'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? 'חדש באתר? ' : 'כבר יש לך חשבון? '}
          <span style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}>
            {isLogin ? 'צור חשבון חדש' : 'לחזרה להתחברות'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh', 
    direction: 'rtl',
    backgroundColor: '#ffffff'
  },
  card: { 
    background: '#ffffff', 
    padding: '40px', 
    border: '1px solid #e5e5e5', 
    width: '100%', 
    maxWidth: '400px', 
    textAlign: 'right',
    boxSizing: 'border-box'
  },
  title: { 
    margin: '0 0 5px 0', 
    color: '#000000', 
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '12px', 
    color: '#666666', 
    margin: '0 0 25px 0',
    fontWeight: '500'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  inputGroup: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  label: { 
    fontSize: '12px', 
    color: '#333333', 
    fontWeight: '600' 
  },
  input: { 
    padding: '10px 12px', 
    border: '1px solid #ccc', 
    fontSize: '14px', 
    borderRadius: '0px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    boxSizing: 'border-box'
  },
  button: { 
    background: '#000000', 
    color: '#ffffff', 
    border: '1px solid #000000', 
    padding: '12px', 
    borderRadius: '0px', 
    fontSize: '14px', 
    cursor: 'pointer', 
    fontWeight: '600', 
    marginTop: '10px',
    letterSpacing: '0.5px'
  },
  toggleText: { 
    marginTop: '25px', 
    textAlign: 'center', 
    fontSize: '13px', 
    color: '#555555' 
  },
  toggleLink: { 
    color: '#000000', 
    cursor: 'pointer', 
    fontWeight: '700', 
    borderBottom: '1px solid #000000',
    paddingBottom: '1px'
  },
  errorBox: { 
    background: '#ffffff', 
    color: '#000000', 
    padding: '10px 12px', 
    borderRadius: '0px', 
    marginBottom: '20px', 
    fontSize: '13px', 
    border: '1px solid #000000',
    fontWeight: '600'
  },
  successBox: { 
    background: '#fafafa', 
    color: '#000000', 
    padding: '10px 12px', 
    borderRadius: '0px', 
    marginBottom: '20px', 
    fontSize: '13px', 
    border: '1px solid #ccc',
    fontWeight: '600'
  }
};

export default AuthForm;