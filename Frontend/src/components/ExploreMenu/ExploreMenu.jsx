import React from 'react'
import style from './explore.module.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className={style.ExploreMenu} id='ExploreMenu'> 
        <h1>Explore Our Menu</h1>
        <p className={style.ExploreMenuText}>From comforting classics to exciting new flavours, explore our diverse menu and find the perfect dish to satisfy your cravings, anytime you want.</p>
        <div className={style.ExploreMenuList}>
          {menu_list.map((item,index)=>{
              return(
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}  key={index} className={style.MenuListItem}>
                  <img className={category===item.menu_name?style.active:""} src={item.menu_image} alt="" />
                  <p>{item.menu_name}</p>
                  
                </div>
              )
          })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu