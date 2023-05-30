import React from 'react'
import '../css/HomePage.css'
import glogo from '../assets/g-logo.png'

export const HomePage = () => {
  return (
    <div className="homepage_container">
        <h1>Länderspiel (aber nicht {'\u26BD'})</h1>
        <h2>Jetzt einloggen</h2>
        <div className="login">
          <button className="gbutton">
            <img src={glogo} alt="google-logo" width="18px"/>
            <span>Mit Google anmelden</span>
          </button>
        </div>
    </div>
  )
}
