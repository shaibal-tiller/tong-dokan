// NavBar.js
import React from 'react';
import logo from '../Assets/mman_logo.png'
const NavBar = () => {

  const menu_items = [{
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
  }, {
    name: 'expense',
    color: '#fafdfc',
    url:"test"
  }]

  return (
    <nav className='bg-light-1 h-16  flex items-center'>
      <div className='w-[10%] h-full flex items-center justify-center'>
        <img className=' h-12 w-12 rounded-full object-cover' src={logo} />
      </div>


      <ul className='w-1/4 flex gap-x-12 text-dark-1 '>
        {menu_items.map(item => {
          return (<a href={`/${item.url}`} className='uppercase font-bold text-sm' >{item.name}</a>)
        })}
      </ul>
      <user>
        <img />
        <p></p>
      </user>
    </nav>
  );
};

export default NavBar;
