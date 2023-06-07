import { Routes, Route } from 'react-router-dom'
import './App.css'
import { FirstRound } from './pages/FirstRound'
import SecondRound from './pages/SecondRound'
import { HomePage } from './pages/HomePage'
import {LoggedHomePage} from './pages/LoggedHomePage'
import SwaggerDocDisplay from './components/ApiDoc/SwaggerDocDisplay'
import Navbar from './components/UI/Navbar'
import Ranking from './components/Ranking/Ranking'

function App() {

  return (
    <div className='container_app'>
      <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/ranking' element={<Ranking/>} />
          <Route path='/logged' element={<LoggedHomePage/>} />
          <Route path='/api/doc' element={<SwaggerDocDisplay/>} />
          <Route path='/game/:game_id/facts' element={<FirstRound/>} />
          <Route path='/game/:game_id/geo-information' element={<SecondRound/>} />
        </Routes> 
    </div>
  )
}

export default App
