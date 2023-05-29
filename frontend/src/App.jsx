import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { FirstRound } from './pages/FirstRound'
import SecondRound from './pages/SecondRound'
import { HomePage } from './pages/HomePage'

function App() {

  return (
    <div className='container_app'>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/game/:game_id/facts' element={<FirstRound/>} />
          <Route path='/game/:game_id/geo-information' element={<SecondRound/>} />
        </Routes> 
      </Router>
    </div>
  )
}

export default App
