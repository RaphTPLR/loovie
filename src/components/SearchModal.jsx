import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

function SearchModal({ isOpen, onClose, movies }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSuggestions([])
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = movies.filter(movie => {
        const title = movie.title || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      }).map(movie => ({
        id: movie.id,
        name: movie.title,
        description: movie.overview,
        imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        rating: Math.round(movie.vote_average / 2)
      }));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, movies]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 top-20 z-50 w-1/2 left-1/2 transform -translate-x-1/2">
      <div className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher un film..."
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4 max-h-[70vh] overflow-y-auto scrollbar">
              {suggestions.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="w-16 h-24 flex-shrink-0">
                    {movie.imageUrl ? (
                      <img
                        src={movie.imageUrl}
                        alt={movie.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{movie.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{movie.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-400 text-sm">{movie.rating}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && suggestions.length === 0 && (
            <div className="mt-4 text-center text-gray-400">
              Aucun film ne correspond à votre recherche
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
