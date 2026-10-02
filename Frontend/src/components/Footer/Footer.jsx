import React from 'react'
import style from './footer.module.css'
import { assets } from '../../assets/assets';
const Footer = () => {
  return (
    <div className={style.Footer} id="Footer">
      <div className={style.FooterContent}>
        <div className={style.FooterContentLeft}>
            <img src={assets.logo} alt=""  className={style.logo}/>
            <p>At QuickBite, every craving deserves something delicious. Explore our diverse menu of flavourful dishes and discover your next favourite bite today.</p>
            <div className={style.FooterSocial}>
                <img src={assets.facebook_icon} alt="" /><img src={assets.twitter_icon} alt="" /><img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className={style.FooterContentMiddle}>
            <h2>
                COMPANY
            </h2>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Deilvery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className={style.FooterContentRight}>
            <h2>Get In Touch</h2>
            <ul>
                <li>+91-8126907270</li>
                <li>Quickbite@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className={style.FooterCopyrigth}>
        CopyRight 2026 ©️ Company.com - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer