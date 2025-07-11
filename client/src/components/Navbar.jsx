import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import {motion} from 'motion/react'

const Navbar = () => {

  const {setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const changeRole = async () =>{
    try{
      const {data } = await axios.post('api/owner/change-role')
      if(data.success){
        setIsOwner(true)
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }

    }
    catch (error){
        toast.error(error.message)


    }
  }
  

  return (
    <motion.div
    initial={{y: -20, opacity:0}} 
    animate={{y: 0, opacity:1}}
    transition={{duration: 0.5}}

      className={`flex items-center justify-between px-4 md:px-10 lg:px-16 py-3
        text-gray-600 border-b border-borderColor relative transition-all ${
          location.pathname === '/' ? 'bg-light' : 'bg-white'
        }`}
    >
      {/* Logo - Shifted more to the left via px-4 */}
      <Link to='/'>
        <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt='logo' className='h-6 md:h-7' />
      </Link>

      {/* Right Side Nav */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-14 max-sm:border-t 
        border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center 
        gap-4 sm:gap-6 max-sm:p-4 transition-all duration-300 z-50 
        ${location.pathname === '/' ? 'bg-light' : 'bg-white'} ${
          open ? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'
        }`}
      >
        {/* Nav Links */}
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} className="text-sm">
            {link.name}
          </Link>
        ))}

        {/* Search Bar */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
          <input
            type='text'
            className='py-1 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search products'
          />
          <img src={assets.search_icon} alt='search' className='h-4 w-4' />
        </div>

        {/* Buttons */}
        <div className='flex items-center gap-4'>
          <button onClick={() =>isOwner ? navigate('/owner') : changeRole()} className='text-sm'>
           {isOwner ? 'Dashboard' : 'List cars'}
          </button>
          <button
            onClick={() => {user ? logout() : setShowLogin(true)}}
            className='text-sm px-5 py-1.5 bg-primary hover:bg-primary-dull transition-all text-white rounded-md'
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Hamburger Menu */}
      <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' />
      </button>
    </motion.div>
  );
};

export default Navbar;
