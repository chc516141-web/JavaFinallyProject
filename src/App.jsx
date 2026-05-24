
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import AuthForm from './components/AuthForm';

// יבוא הדפים והקומפוננטות המפוצלות
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import OrdersTable from './components/OrdersTable';
import CarCard from './components/CarCard';

// רכיב ה-Splash המתוזמן במדויק
const Splash = ({ onFinished }) => {
  useEffect(() => {
    // הדף ייטען בדיוק 2.6 שניות מתחילת האנימציה (מיד כשהרכב מסיים לנסוע)
    const timer = setTimeout(() => {
      onFinished();
    }, 2600); 
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div style={styles.splashContainer}>
      {/* הזרקת האנימציה המהירה והחלקה */}
      <style>{`
        @keyframes driveAcrossEntireScreen {
          0% {
            transform: translateX(-150px);
          }
          100% {
            transform: translateX(115vw); /* יוצא לחלוטין מגבולות המסך הימניים */
          }
        }
      `}</style>

      <div style={styles.animationWrapper}>
        {/* זמן האנימציה קוצר ל-2.5 שניות לנסיעה זורמת וקולעת */}
        <div style={styles.animatedCarWrapper}>
          <img src="/sports-car.png" alt="Car" style={styles.splashCarImage} />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const [showSplash, setShowSplash] = useState(true)
  const [startAuth, setStartAuth] = useState(false)

  const [profileForm, setProfileForm] = useState({ fullName: '', username: '', phone: '050-0000000' })
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [orders, setOrders] = useState([])
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [editForm, setEditForm] = useState({ customerName: '', customerPhone: '', carBrandAndModel: '', finalPrice: 0 })

  const [selectedCar, setSelectedCar] = useState(null)
  const [cart, setCart] = useState([]) 
  const [isCartOpen, setIsCartOpen] = useState(false) 

  const [newCarForm, setNewCarForm] = useState({ brand: '', model: '', productionYear: '', price: '', imageFile: '' })
  const [completedOrder, setCompletedOrder] = useState(null)

  const [showUserOrders, setShowUserOrders] = useState(false) 
  const [showAdminAddCar, setShowAdminAddCar] = useState(false) 
  const [showAdminOrders, setShowAdminOrders] = useState(false) 

  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cars')
      setCars(response.data)
      setLoading(false)
    } catch (error) {
      console.error("שגיאה בטעינת הרכבים:", error)
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders', {
        params: {
          search: searchTerm || null,
          minPrice: minPrice ? Number(minPrice) : null,
          maxPrice: maxPrice ? Number(maxPrice) : null
        }
      })
      setOrders(response.data)
    } catch (error) {
      console.error("שגיאה בטעינת ההזמנות מהשרת:", error)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [searchTerm, minPrice, maxPrice, user])

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, fullName: profileForm.fullName, username: profileForm.username, phone: profileForm.phone });
    setIsEditingProfile(false);
    alert("הפרופיל עודכן בהצלחה");
  }

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/cars', {
        ...newCarForm, productionYear: Number(newCarForm.productionYear), price: Number(newCarForm.price)
      })
      setCars([...cars, response.data]) 
      setNewCarForm({ brand: '', model: '', productionYear: '', price: '', imageFile: '' }) 
      setShowAdminAddCar(false) 
      alert("הרכב התווסף למלאי בהצלחה")
    } catch (error) {
      console.error("שגיאה בהוספת הרכב:", error)
    }
  }

  const handleAddToCart = (car) => {
    setCart([...cart, car])
    setIsCartOpen(true) 
  }

  const handleRemoveFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    const allCarsString = cart.map(c => `${c.brand} ${c.model}`).join(', ')
    const totalCartPrice = cart.reduce((sum, c) => sum + c.price, 0)

    const newOrder = {
      customerName: user ? user.fullName : "לקוח כללי",
      customerPhone: user?.phone || "050-0000000",
      carBrandAndModel: allCarsString,
      finalPrice: totalCartPrice
    }

    try {
      const response = await axios.post('http://localhost:8080/api/orders', newOrder)
      setOrders([...orders, response.data])
      setCompletedOrder(response.data) 
      setCart([]) 
      setIsCartOpen(false) 
    } catch (error) {
      console.error("שגיאה בביצוע ההזמנה:", error)
    }
  }

  const handleDeleteOrder = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await axios.delete(`http://localhost:8080/api/orders/${id}`)
        setOrders(orders.filter(order => order.id !== id))
      } catch (error) { console.error(error) }
    }
  }

  const startEdit = (order) => {
    setEditingOrderId(order.id)
    setEditForm({ customerName: order.customerName, customerPhone: order.customerPhone, carBrandAndModel: order.carBrandAndModel, finalPrice: order.finalPrice })
  }

  const handleUpdateOrder = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/orders/${id}`, editForm)
      setOrders(orders.map(order => order.id === id ? response.data : order))
      setEditingOrderId(null)
      alert("ההזמנה עודכנה")
    } catch (error) { console.error(error) }
  }

  const displayedOrders = user && user.role === 'admin' 
    ? orders 
    : orders.filter(order => order.customerName === user?.fullName);

  return (
    <div className="app-container" style={{ direction: 'rtl', padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      
      {showSplash ? (
        /* 1. ה-Splash החדש והנקי עם רכב אחד שנוסע לאט */
        <Splash onFinished={() => setShowSplash(false)} />
      ) : !user ? (
        /* 2. לאחר מכן מעבר למסך הלוגו עם כפתור הכניסה */
        !startAuth ? (
          <div style={styles.landingPage}>
            <h1 style={styles.landingLogo}>MOTORS GALLERY</h1>
            <p style={styles.landingSubtitle}>אולם תצוגה דיגיטלי לרכבי יוקרה</p>
            <button onClick={() => setStartAuth(true)} style={styles.landingBtn}>כניסה להתחברות</button>
          </div>
        ) : (
          <AuthForm onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setProfileForm({ fullName: loggedInUser.fullName || 'לקוח', username: loggedInUser.username, phone: '050-0000000' });
          }} />
        )
      ) : loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען נתונים...</div>
      ) : completedOrder ? (
        
        <div style={styles.successPage}>
          <div style={styles.successCard}>
            <h1 style={{ color: '#000', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>ההזמנה התקבלה</h1>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '30px' }}>תודה, <strong>{completedOrder.customerName}</strong>. פנייתך הועברה לנציג שירות.</p>
            <div style={styles.successDetailsBox}>
              <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '15px', fontSize: '16px' }}>פרטי הרכישה</h3>
              <p style={{ margin: '8px 0' }}><strong>דגמים:</strong> {completedOrder.carBrandAndModel}</p>
              <p style={{ margin: '8px 0' }}><strong>טלפון:</strong> {completedOrder.customerPhone}</p>
              <p style={{ margin: '8px 0', fontSize: '16px', marginTop: '15px' }}><strong>סך הכל:</strong> {completedOrder.finalPrice.toLocaleString()} ₪</p>
            </div>
            <button onClick={() => setCompletedOrder(null)} style={styles.blackBtn}>חזרה לקטלוג</button>
          </div>
        </div>

      ) : (
        <>
          {/* אפליקציה ראשית */}
          <header className="app-header" style={styles.welcomeHeader}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>MOTORS GALLERY</h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#666' }}>
                שלום, {user.fullName} {user.role === 'admin' ? <span>(מנהל מערכת)</span> : <span>(לקוח סוכנות)</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {user.role === 'user' && (
                <>
                  <button onClick={() => setIsEditingProfile(!isEditingProfile)} style={styles.outlineBtn}>
                    {isEditingProfile ? 'סגור אזור אישי' : 'אזור אישי'}
                  </button>
                  <button onClick={() => setIsCartOpen(true)} style={styles.blackBtn}>עגלת רכישה ({cart.length})</button>
                </>
              )}
              <button onClick={() => setUser(null)} style={styles.outlineBtn}>התנתק</button>
            </div>
          </header>

          {user.role === 'user' && isEditingProfile && (
            <UserProfile 
              profileForm={profileForm} setProfileForm={setProfileForm} 
              handleUpdateProfile={handleUpdateProfile} 
              showUserOrders={showUserOrders} setShowUserOrders={setShowUserOrders} 
            />
          )}

          {user.role === 'admin' && (
            <AdminDashboard 
              showAdminAddCar={showAdminAddCar} setShowAdminAddCar={setShowAdminAddCar}
              showAdminOrders={showAdminOrders} setShowAdminOrders={setShowAdminOrders}
              handleAddCar={handleAddCar} newCarForm={newCarForm} setNewCarForm={setNewCarForm}
            />
          )}

          <section style={{ marginTop: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '25px' }}>רכבים זמינים בתצוגה</h2>
            <main className="cars-grid">
              {cars.map((car, index) => (
                <CarCard key={index} car={car} user={user} handleAddToCart={handleAddToCart} setSelectedCar={setSelectedCar} />
              ))}
            </main>
          </section>

          {((user.role === 'admin' && showAdminOrders) || (user.role === 'user' && showUserOrders)) && (
            <>
              <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
              <OrdersTable 
                user={user} displayedOrders={displayedOrders} editingOrderId={editingOrderId} 
                setEditingOrderId={setEditingOrderId} editForm={editForm} setEditForm={setEditForm} 
                handleUpdateOrder={handleUpdateOrder} startEdit={startEdit} handleDeleteOrder={handleDeleteOrder} 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={maxPrice}
              />
            </>
          )}

          {isCartOpen && user.role === 'user' && (
            <div style={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
              <div style={styles.cartSidebar} onClick={(e) => e.stopPropagation()}>
                <div style={styles.cartHeader}>
                  <h2>העגלה שלי</h2>
                  <span style={styles.closeCart} onClick={() => setIsCartOpen(false)}>&times;</span>
                </div>
                <div style={styles.cartItemsWrapper}>
                  {cart.length === 0 ? <p style={{ textAlign: 'center', marginTop: '40px' }}>העגלה ריקה</p> : 
                    cart.map((car, index) => (
                      <div key={index} style={styles.cartItem}>
                        <div>
                          <h4>{car.brand} {car.model}</h4>
                          <p style={{ color: '#000', margin: '4px 0 0 0', fontWeight: 'bold' }}>{car.price.toLocaleString()} ₪</p>
                        </div>
                        <button onClick={() => handleRemoveFromCart(index)} style={styles.removeCartItemBtn}>הסר</button>
                      </div>
                    ))
                  }
                </div>
                {cart.length > 0 && (
                  <div style={styles.cartFooter}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 'bold' }}>
                      <span>סה"כ לתשלום:</span>
                      <span style={{ color: '#000' }}>{cart.reduce((sum, c) => sum + c.price, 0).toLocaleString()} ₪</span>
                    </div>
                    <button onClick={handleCheckout} style={styles.blackBtn}>בצע הזמנה סופית וסגור רכישה</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedCar && (
            <div style={styles.modalOverlay} onClick={() => setSelectedCar(null)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span style={styles.closeModal} onClick={() => setSelectedCar(null)}>&times;</span>
                <img src={selectedCar.imageFile ? `/${selectedCar.imageFile}` : '/default-car.jpg'} alt={`${selectedCar.brand} ${selectedCar.model}`} style={styles.modalImage} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' }} />
                <h2 style={{ marginTop: '15px' }}>{selectedCar.brand} {selectedCar.model}</h2>
                <div style={styles.modalDetails}>
                  <p><strong>שנת ייצור:</strong> {selectedCar.productionYear}</p>
                  <p><strong>מחיר רשמי:</strong> {selectedCar.price.toLocaleString()} ₪</p>
                </div>
                {user.role === 'user' && (
                  <button onClick={() => { handleAddToCart(selectedCar); setSelectedCar(null); }} style={styles.blackBtn}>הוסף לעגלה</button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  // עיצוב ה-Splash המינימליסטי
  splashContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#ffffff', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  animationWrapper: { position: 'relative', width: '100vw', height: '150px', display: 'flex', alignItems: 'center' },
  // הנסיעה מוגדרת ל-4 שניות, ו-forwards גורם לו להישאר במיקום הסופי (מחוץ למסך) ולא לקפוץ חזרה להתחלה
  animatedCarWrapper: { position: 'absolute', left: 0, animation: 'driveAcrossEntireScreen 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' },
  splashCarImage: { width: '140px', height: 'auto', display: 'block', backgroundColor: 'transparent' },

  // שאר דפי המערכת
  landingPage: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center' },
  landingLogo: { fontSize: '48px', fontWeight: '900', letterSpacing: '3px', margin: '0 0 10px 0' },
  landingSubtitle: { fontSize: '16px', color: '#666', marginBottom: '40px', letterSpacing: '1px' },
  landingBtn: { background: '#000000', color: '#ffffff', border: 'none', padding: '15px 40px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' },
  welcomeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '20px', marginBottom: '30px', borderBottom: '1px solid #000' },
  blackBtn: { background: '#000000', color: '#ffffff', border: 'none', padding: '12px 20px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.5px' },
  outlineBtn: { background: 'transparent', color: '#000000', border: '1px solid #000000', padding: '12px 20px', cursor: 'pointer', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#fff', padding: '30px', width: '90%', maxWidth: '600px', position: 'relative', textAlign: 'right', border: '1px solid #000' },
  closeModal: { position: 'absolute', top: '15px', left: '20px', fontSize: '30px', cursor: 'pointer', color: '#000', fontWeight: 'bold' },
  modalImage: { width: '100%', height: '350px', objectFit: 'cover' },
  modalDetails: { marginTop: '15px', background: '#f8f9fa', padding: '15px', border: '1px solid #eee' },
  cartOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000 },
  cartSidebar: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '350px', background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', textAlign: 'right', borderLeft: '1px solid #000' },
  cartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #000', paddingBottom: '15px' },
  closeCart: { fontSize: '28px', cursor: 'pointer', color: '#000', fontWeight: 'bold' },
  cartItemsWrapper: { flex: 1, overflowY: 'auto', marginTop: '15px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fafafa', marginBottom: '10px', border: '1px solid #eee' },
  removeCartItemBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#ff0000' },
  cartFooter: { borderTop: '1px solid #000', paddingTop: '15px', marginTop: '15px' },
  successPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  successCard: { background: '#fff', padding: '40px', border: '1px solid #000', textAlign: 'center', maxWidth: '500px', width: '100%' },
  successDetailsBox: { background: '#fafafa', border: '1px solid #eee', padding: '20px', marginTop: '20px', textAlign: 'right' }
};

export default App;