import React from 'react'
import style from './appdownload.module.css'
import {assets} from "../../assets/assets"

const AppDownload = () => {
  return (
    <div className={style.AppDownload} id='AppDownload'>
        <p>For better Experience Download Our App</p>
        <div className={style.AppDownloadPlatforms}>
          <h1>QUICKBITE</h1>
            <img src={assets.play_store} alt="" />
            <img src={assets.app_store} alt="" />
        </div>
    </div>
  )
}
export default AppDownload