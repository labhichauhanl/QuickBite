import React from 'react'
import style from './header.module.css'

const Header = () => {
  return (
    <div className={style.header}>
        <div className={style.headerContent}>
            <h2>Craving Meets Their Match.</h2>
            <p>Discover delicious meals and have your favourites <br />
            delivered right to your door.</p>
            <button className={style.viewbutt}>View Menu</button>
        </div>
    </div>
  )
}

export default Header