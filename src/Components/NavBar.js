// NavBar.js
import React from 'react';
import logo from '../Assets/mman_logo.png'
import { useNavigate } from 'react-router-dom';
import { GetContext } from '../Context';
const NavBar = ({ user }) => {
  const myContext = GetContext()
  const menu_items = [{
    name: 'Add Product',
    color: '#fafdfc',
    url: "/newProduct"
  }, /* {
    name: 'expense',
    color: '#fafdfc',
    url:"test"
  }, {
    name: 'expense',
    color: '#fafdfc',
    url:"test"
  }, {
    name: 'expense',
    color: '#fafdfc',
    url:"test"
  } */]
  const navigate = useNavigate()
  const handlehome = (e) => {
    navigate('')
  }

  const handleLogout = (e) => {
    myContext.handleLogout()
  }
  return (
    <nav className='bg-light-1 h-16  flex items-center'>
      {/*   <div className='w-[10%] h-full flex items-center justify-center'>
        <img className=' h-12 w-12 rounded-full object-cover' src={logo} onClick={handlehome} />
      </div> */}
      <div className='w-full  flex justify-start items-center   text-dark-1'>
        <img src={logo} className='h-16 w-16 p-2 shadow-sm shadow-lime-300 rounded-full' onClick={handlehome} />
        <p className='text-xl font-semibold   -tracking-[.015em]'>Tong - Dokan Wallet</p>
      </div>


      {/* {user && <ul className='w-1/4 flex gap-x-12 text-dark-1 '>
        {menu_items.map(item => {
          return (<a href={`${item.url}`} className='uppercase font-bold text-sm' >{item.name}</a>)
        })}
      </ul>} */}
      {user ? <div className='absolute right-[5%] top-2 w-24 group  cursor-pointer '>

        <img className='ml-auto rounded-full h-10 w-10 mr-5 ' src={user?.reloadUserInfo?.photoUrl} />
        <p className=' font-bold text-sm text-end w-full -leading-10'>{user?.displayName || "N/A"}</p>
        <div className=' select-none hover:scale-105 active:scale-95 hidden group-hover:flex mx-auto
          font-bold tracking-wide text-red-600  h-6 bg-gray-300  justify-center items-center'
          onClick={handleLogout}>
          <p>Logout</p>
        </div>
      </div> : <></>}
    </nav>
  );
};

export default NavBar;
