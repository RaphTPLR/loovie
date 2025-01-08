import { Link, useLocation } from 'react-router-dom'
import { Search, UserIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Loovie from '../assets/loovie.svg'
import SearchModal from './SearchModal'

const API_KEY = 'e7fecaf18d375e25b3d82f7d53c8ef97'

function TopBar() {
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
            api_key: API_KEY,
            language: 'fr-FR',
            query: 'a',
            include_adult: false,
            page: 1
          },
        })
        setMovies(response.data.results)
      } catch (err) {
        console.error('Erreur lors de la récupération des films :', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <>
      <div className="h-20 bg-black w-[100vw]">
        <div className="container mx-auto fixed top-0 left-1/2 transform -translate-x-1/2 w-full z-50 bg-black">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gray-300 grid place-items-center rounded-sm">
                <UserIcon size={26} stroke='#020202' />
              </div>
              <p>Invité</p>
            </div>
            <div className="flex space-x-8 items-center">
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 focus:outline-none transition-colors rounded-full duration-200 ${isSearchOpen ? 'bg-primary' : 'hover:text-primary'}`}
              >
                <Search size={20} />
              </button>
              <Link
                to="/"
                className={`inline-flex items-center px-5 py-2 text-normal font-medium rounded-full ${
                  location.pathname === '/' ? 'bg-primary' : 'hover:text-primary'
                }`}
              >
                Films
              </Link>
              <Link
                to="/my-loovies"
                className={`inline-flex items-center px-5 py-2 text-normal font-medium rounded-full ${
                  location.pathname === '/my-loovies' ? 'bg-primary' : 'hover:text-primary'
                }`}
              >
                Mes Loovies
              </Link>
              <Link
                to="/profil"
                className={`inline-flex items-center px-5 py-2 text-normal font-medium rounded-full ${
                  location.pathname === '/profil' ? 'bg-primary' : 'hover:text-primary'
                }`}
              >
                Profil
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center">
                <img src={Loovie} alt="" className="w-8 h-8" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        movies={movies}
      />
    </>
  )
}

export default TopBar
