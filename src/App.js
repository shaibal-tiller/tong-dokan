// App.js
import React from 'react';
import NavBar from './Components/NavBar';
import SideDrawer from './Components/SideDrawer ';
import Dashboard from './Pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import AddExpense from './Pages/AddExpense';
import AddPayement from './Pages/AddPayement';


const App = () => {
  return (
    <div className='bg-dark-1 h-screen w-full lg:overflow-hidden'>
      <NavBar />
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/pay" element={<AddPayement />} />
      </Routes>


    </div>
  );
};

export default App;
