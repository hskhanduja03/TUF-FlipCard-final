import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';

function Layout() {
  const location = useLocation();

  // Show Home component only when the path is "/"
  const isHomePage = location.pathname === '/';

  return (
    <div className='flex flex-col min-h-screen '>
      <div className=""><Navbar /></div>
      {isHomePage ? <Home /> : <Outlet />}
    </div>
  );
}

export default Layout;
