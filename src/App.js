// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Dashboard from './Pages/Dashboard';
import AddExpense from './Pages/AddExpense';
import AddPayement from './Pages/AddPayement';
import ProductForm from './Pages/ProductForm';
import SendToFirebase from './Pages/SendToFirebase';
import SignIn from './Pages/SignIn'; // Import SignIn component
import { AppContext } from './Context';
import { auth } from './Components/firebaseConfig'; // Import initialized Firebase auth
import BottomNav from './Components/BottomNav';
import Modal from './Components/Modal';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const [productList, setProductList] = useState(null)
  const [monthExpenseDetails, setMonthExpenseDetails] = useState(null)
  const [balance, setBalance] = useState(0)
  const [today_data, set_today_data] = useState(0)
  const [huddai, setHuddai] = useState(0)



  const data = {
    productList, setProductList,
    monthExpenseDetails, setMonthExpenseDetails,
    balance, setBalance,
    today_data, set_today_data,
    huddai, setHuddai
  }
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppContext.Provider value={{ user, handleLogout, ...data }}>
      <BrowserRouter>
        <div className='bg-dark-1 h-screen w-full lg:overflow-hidden'>
          <NavBar user={user}/>
        
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/add" element={user ? <AddExpense /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
            <Route path="/pay" element={user ? <Modal /> : <Navigate to="/signin" />} />
            <Route path="/test" element={user ? <SendToFirebase /> : <Navigate to="/signin" />} />
            <Route path="/newProduct" element={user ? <ProductForm /> : <Navigate to="/signin" />} />
          </Routes>
    {user &&      <BottomNav/>}
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
