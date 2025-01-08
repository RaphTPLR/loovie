import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import Home from './features/Home/Home'
import Profil from './features/Profil/Profil'
import ShowMovie from './features/Movie/ShowMovie'
import MyLoovies from './features/MyLoovies/MyLoovies'
import './App.css'

function AppContent() {
  const location = useLocation()
  const showTopBar = !location.pathname.includes('/movie/')

  return (
    <div className="min-h-screen">
      {showTopBar && <TopBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/my-loovies" element={<MyLoovies />} />
        <Route path="/movie/:id" element={<ShowMovie />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
