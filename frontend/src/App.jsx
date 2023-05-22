import { useState } from 'react'
//import { BrowserRouter as Router, Routes, Route } from '../../node_modules/react-router-dom'
import './App.css'
import { FirstRound } from './pages/FirstRound'
import { HomePage } from './pages/HomePage'

function App() {

  return (
    <div className='container_app'>
      <HomePage/>
    {  
      /*
      Who the fuck knows why this shit is not working.
      Tried:
        ./frontend: npm install react-router-dom
        .root: npm install react-router-dom    and npm install react-router-dom --save



        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/game/:game_id/facts' element={<FirstRound/>} />
          </Routes>
        </Router>
        */}
    </div>
  )
}

export default App
