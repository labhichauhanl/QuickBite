import React from 'react'
import './Navbar.css'
import {assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='Navbar'>
      <img className='logo' src={assets.logo} alt=""  />
      <h1>ADMIN PORTAL</h1> 
      <div className="admin-profile">
    <div className="admin-info">
        <p className="admin-name">Abhyudai Singh</p>
    </div>

    <img src={assets.profile_image} alt="Admin" />
</div>
    </div>
  )
}

export default Navbar
