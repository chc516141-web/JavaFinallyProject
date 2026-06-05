import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'
import AuthForm from './components/AuthForm';

// יבוא הדפים והקומפוננטות המפוצלות
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import OrdersTable from './components/OrdersTable';
import CarCard from './components/CarCard';

const Splash = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2600); 
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div style={styles.splashContainer}>
      <style>{`
        @keyframes driveAcrossEntireScreen {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(115vw); }
        }
      `}</style>
      <div style={styles.animationWrapper}>
        <div style={styles.animatedCarWrapper}>
          <img src="/sports-car.png" alt="Car" style={styles.splashCarImage} />
        </div>
      </div>
    </div>
  );
};

function App() {
  const [cars, setCars] = useState([])
  const [topCars, setTopCars] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const [showSplash, setShowSplash] = useState(true)
  const [startAuth, setStartAuth] = useState(false)

  const [profileForm, setProfileForm] = useState({ fullName: '', username: '', phone: '050-0000000' })
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [orders, setOrders] = useState([])

  const [selectedCar, setSelectedCar] = useState(null)
  const [cart, setCart] = useState([]) 
  const [isCartOpen, setIsCartOpen] = useState(false) 

  const [newCarForm, setNewCarForm] = useState({ brand: '', model: '', productionYear: '', price: '', imageFile: '' })
  const [completedOrder, setCompletedOrder] = useState(null)

  const [showUserOrders, setShowUserOrders] = useState(false) 
  const [showAdminAddCar, setShowAdminAddCar] = useState(false) 
  const [showAdminOrders, setShowAdminOrders] = useState(false) 

  const ordersSectionRef = useRef(null)

  // סינוני קטלוג רכבים ראשי
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [appliedMinPrice, setAppliedMinPrice] = useState('')
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('')

  // סטייט מאוחד לסינוני הפניות
  const [activeOrderFilters, setActiveOrderFilters] = useState({ search: '', date: '', minPrice: '', maxPrice: '' });

  const scrollToOrders = () => {
    setTimeout(() => {
      if (ordersSectionRef.current) {
        ordersSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  const fetchCars = async () => {
    try {
      setLoading(true)
      let url = 'http://localhost:8080/api/cars'
      let config = {}

      if (appliedMinPrice && appliedMaxPrice) {
        url = 'http://localhost:8080/api/cars/search'
        config.params = { min: Number(appliedMinPrice), max: Number(appliedMaxPrice) }
      }

      const response = await axios.get(url, config)
      setCars(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error("שגיאה בטעינת הרכבים:", error)
      setLoading(false)
    }
  }

  const fetchTopNewestCars = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cars/newest')
      setTopCars(response.data || [])
    } catch (error) {
      console.error("שגיאה בטעינת הרכבים החדשים ביותר:", error)
    }
  }

  const handleApplyDiscount = async (brand, percentage) => {
    try {
      const response = await axios.put('http://localhost:8080/api/cars/discount', null, {
        params: { brand, percentage: Number(percentage) }
      })
      alert(response.data) 
      fetchCars() 
    } catch (error) {
      console.error("שגיאה בהחלת ההנחה:", error)
      alert("נכשלה החלת ההנחה. ודא כי שם היצרן מדויק.")
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders')
      // וידוא שלכל פנייה יש שדה אופציונלי של allowClientEdit
      const formattedOrders = (response.data || []).map(o => ({...o, allowClientEdit: o.allowClientEdit || false}));
      setOrders(formattedOrders)
    } catch (error) {
      console.error("שגיאה בטעינת ההזמנות מהשרת:", error)
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPriceInput);
    setAppliedMaxPrice(maxPriceInput);
  }

  const handleResetFilter = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
  }

  useEffect(() => {
    fetchCars()
  }, [appliedMinPrice, appliedMaxPrice])

  useEffect(() => {
    fetchTopNewestCars()
  }, [])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    if (user?.role === 'admin' && showAdminOrders) {
      scrollToOrders();
    }
  }, [showAdminOrders])

  useEffect(() => {
    if (user?.role === 'user' && isEditingProfile && showUserOrders) {
      scrollToOrders();
    }
  }, [showUserOrders, isEditingProfile])

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
      fetchTopNewestCars()
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
      finalPrice: totalCartPrice,
      status: 'ההזמנה אושרה', // ברירת מחדל תואמת לסרגל
      allowClientEdit: false
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
    if (window.confirm("האם למחוק פניה זו לצמיתות מהמערכת?")) {
      try {
        await axios.delete(`http://localhost:8080/api/orders/${id}`)
        setOrders(orders.filter(order => order.id !== id))
      } catch (error) { console.error(error) }
    }
  }

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id);
      if (!orderToUpdate) return;

      setOrders(prevOrders => prevOrders.map(order => order.id === id ? { ...order, status: newStatus } : order));

      await axios.put(`http://localhost:8080/api/orders/${id}`, {
        ...orderToUpdate,
        status: newStatus
      });
    } catch (error) {
      console.error("שגיאה בסנכרון הסטטוס מול השרת:", error);
    }
  }

  // פונקציה חדשה: מנהל מאשר/חוסם גישת עריכה ללקוח
  const handleToggleClientEdit = async (id, allowStatus) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id);
      if (!orderToUpdate) return;

      setOrders(prevOrders => prevOrders.map(order => order.id === id ? { ...order, allowClientEdit: allowStatus } : order));

      await axios.put(`http://localhost:8080/api/orders/${id}`, {
        ...orderToUpdate,
        allowClientEdit: allowStatus
      });
    } catch (error) {
      console.error("שגיאה בעדכון הרשאת עריכה:", error);
    }
  }

  // פונקציה חדשה: לקוח מעדכן את הפנייה שלו מרחוק
  const handleClientUpdateOrder = async (id, updatedFields) => {
    try {
      const orderToUpdate = orders.find(o => o.id === id);
      if (!orderToUpdate) return;

      const finalUpdated = { ...orderToUpdate, ...updatedFields, allowClientEdit: false }; // סגירת הרשאה לאחר עדכון

      setOrders(prevOrders => prevOrders.map(order => order.id === id ? finalUpdated : order));

      await axios.put(`http://localhost:8080/api/orders/${id}`, finalUpdated);
      alert("הפנייה עודכנה בהצלחה ונשלחה חזרה למנהל!");
    } catch (error) {
      console.error("שגיאה בעדכון הנתונים ע\"י הלקוח:", error);
    }
  }

  const getFilteredOrders = () => {
    if (!orders || !Array.isArray(orders)) return [];

    let baseOrders = user && user.role === 'admin' 
      ? orders 
      : orders.filter(order => order && order.customerName === user?.fullName);

    const { search, date, minPrice, maxPrice } = activeOrderFilters;

    if (search) {
      const searchLower = search.toLowerCase();
      baseOrders = baseOrders.filter(o => {
        const carMatch = o.carBrandAndModel ? o.carBrandAndModel.toLowerCase().includes(searchLower) : false;
        const nameMatch = o.customerName ? o.customerName.toLowerCase().includes(searchLower) : false;
        return carMatch || nameMatch;
      });
    }

    if (date) {
      baseOrders = baseOrders.filter(o => {
        const orderDateStr = o.orderDate || o.createdAt || o.date || '';
        return orderDateStr.toString().includes(date);
      });
    }

    if (user && user.role === 'admin') {
      if (minPrice) {
        baseOrders = baseOrders.filter(o => o.finalPrice >= Number(minPrice));
      }
      if (maxPrice) {
        baseOrders = baseOrders.filter(o => o.finalPrice <= Number(maxPrice));
      }
    }

    return baseOrders;
  };

  const displayedOrders = getFilteredOrders();

  return (
    <div className="app-container" style={{ direction: 'rtl', padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      
      {showSplash ? (
        <Splash onFinished={() => setShowSplash(false)} />
      ) : !user ? (
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
                </                >
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
              handleApplyDiscount={handleApplyDiscount} 
            />
          )}

          {/* 3 הרכבים החדשים ביותר */}
          {topCars.length > 0 && !appliedMinPrice && !appliedMaxPrice && (
            <section style={{ marginTop: '20px', backgroundColor: '#fdfdfd', padding: '20px', border: '1px dashed #000' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#d9534f' }}>🔥 הלהיטים החדישים ביותר באולם</h2>
              <main className="cars-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {topCars.map((car, index) => (
                  <div key={`top-${index}`} style={{ flex: '1', minWidth: '250px', border: '1px solid #ddd', padding: '10px' }}>
                    <h4>{car.brand} {car.model} ({car.productionYear})</h4>
                    <p>מחיר: {car.price.toLocaleString()} ₪</p>
                    <button onClick={() => setSelectedCar(car)} style={{ ...styles.outlineBtn, padding: '5px 10px', fontSize: '12px' }}>פרטים נוספים</button>
                  </div>
                ))}
              </main>
            </section>
          )}

          {/* קטלוג ראשי */}
          <section style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>רכבים זמינים בתצוגה</h2>
              
              <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  placeholder="מחיר מ..." 
                  value={minPriceInput} 
                  onChange={(e) => setMinPriceInput(e.target.value)} 
                  style={{ padding: '8px', border: '1px solid #000', width: '110px', color: '#000000', fontWeight: 'bold' }} 
                />
                <input 
                  type="number" 
                  placeholder="עד מחיר..." 
                  value={maxPriceInput} 
                  onChange={(e) => setMaxPriceInput(e.target.value)} 
                  style={{ padding: '8px', border: '1px solid #000', width: '110px', color: '#000000', fontWeight: 'bold' }} 
                />
                <button type="submit" style={{ ...styles.blackBtn, padding: '8px 15px', fontSize: '13px' }}>סנן תוצאות</button>
                {(appliedMinPrice || appliedMaxPrice || minPriceInput || maxPriceInput) && (
                  <button type="button" onClick={handleResetFilter} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#666' }}>אפס סינון</button>
                )}
              </form>
            </div>

            <main className="cars-grid">
              {cars.length === 0 ? <p>לא נמצאו רכבים בטווח מחירים זה.</p> : 
                cars.map((car, index) => (
                  <CarCard key={index} car={car} user={user} handleAddToCart={handleAddToCart} setSelectedCar={setSelectedCar} />
                ))
              }
            </main>
          </section>

          {/* טבלת פניות/היסטוריה */}
          {((user.role === 'admin' && showAdminOrders) || (user.role === 'user' && isEditingProfile && showUserOrders)) && (
            <div ref={ordersSectionRef} style={{ scrollMarginTop: '20px' }}>
              <hr style={{ margin: '40px 0', border: '0', borderTop: '2px dashed #ccc' }} />
              <OrdersTable 
                user={user} 
                displayedOrders={displayedOrders} 
                handleDeleteOrder={handleDeleteOrder} 
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                handleToggleClientEdit={handleToggleClientEdit}
                handleClientUpdateOrder={handleClientUpdateOrder}
                onApplyFilters={(filters) => setActiveOrderFilters(filters)}
              />
            </div>
          )}

          {/* עגלת קניות */}
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

          {/* מודאל פרטי רכב */}
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
  splashContainer: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', overflow: 'hidden', zIndex: 9999 },
  animationWrapper: { position: 'relative', width: '100vw', height: '150px', display: 'flex', alignItems: 'center' },
  animatedCarWrapper: { position: 'absolute', left: 0, animation: 'driveAcrossEntireScreen 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' },
  splashCarImage: { width: '140px', height: 'auto', display: 'block', backgroundColor: 'transparent' },
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