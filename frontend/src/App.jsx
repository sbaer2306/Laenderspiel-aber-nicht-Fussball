import { Routes, Route } from 'react-router-dom'
import './App.css'
import { FirstRound } from './pages/FirstRound'
import SecondRound from './pages/SecondRound'
import ThirdRound from './pages/ThirdRound'
import { HomePage } from './pages/HomePage'
import { Login } from './pages/Login'
import {LoggedHomePage} from './pages/LoggedHomePage'
import SwaggerDocDisplay from './components/ApiDoc/SwaggerDocDisplay'
import Navbar from './components/UI/Navbar'
import Ranking from './components/Ranking/Ranking'
import PublicProfileOverview from './components/profile/PublicProfileOverview'
import PrivateProfileOverview from './components/profile/editing/PrivateProfileOverview'
import { UserAuthContextProvider } from './hooks/userAuthContext'
import LoggedInHomepage from './pages/LoggedInHomepage'
import ProtectedRoute from './components/Auth/ProtectedRoute'

function App() {

  return (
    <div className='container_app'>
      <UserAuthContextProvider>
      <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/ranking' element={<Ranking/>} />
          <Route path='/logged' element={<LoggedHomePage/>} />
          <Route path='/api/doc' element={<SwaggerDocDisplay/>} />
          <Route path='logged/game/facts' element={<FirstRound/>} />  {/*logged only for testing purposes for now */}
          <Route path='logged/game/geo-information' element={<SecondRound/>} />
          <Route path='logged/game/sights' element={<ThirdRound />} />
          <Route path='/game/:game_id/sights' element={<ThirdRound />} />

          {/*PROTECTED ROUTES*/}
          <Route path='/welcome' element={<ProtectedRoute><LoggedInHomepage/></ProtectedRoute>} />
          <Route path='/user/:id/public-profile' element={<ProtectedRoute><PublicProfileOverview/></ProtectedRoute>} />
          <Route path='/user/profile' element={<ProtectedRoute><PrivateProfileOverview/></ProtectedRoute>} />
        </Routes> 
        </UserAuthContextProvider>
    </div>
  )
}

export default App
