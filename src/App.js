// App.js
import React, { useState } from 'react';
import NavBar from './Components/NavBar';
import SideDrawer from './Components/SideDrawer ';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddExpense from './Pages/AddExpense';
import AddPayement from './Pages/AddPayement';
import ProductForm from './Pages/ProductForm';
import { AppContext } from './Context'
import SendToFirebase from './Pages/SendToFirebase';

const App = () => {

  const [productList, setProductList] = useState(null)

  const data= {
    productList, setProductList
  }


  return (
    <AppContext.Provider value={data}>
      <BrowserRouter>
        <div className='bg-dark-1 h-screen w-full lg:overflow-hidden'>
          <NavBar />
          <SideDrawer />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/pay" element={<AddPayement />} />
            <Route path="/test" element={<SendToFirebase />} />
            <Route path="/newProduct" element={<ProductForm />} />
          </Routes>


        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
