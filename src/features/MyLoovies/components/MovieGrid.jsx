import { useState } from 'react'
import { TrashIcon, PencilIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

function MovieGrid({ movies, title, onDeleteMovie }) {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    rating: 0
  })

  const handleEditClick = (movie, e) => {
    e.stopPropagation()
    setEditingMovie(movie)
    setEditForm({
      name: movie.name,
      description: movie.description,
      rating: movie.rating
    })
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]')
    const updatedMovies = savedMovies.map(movie => {
      if (movie.id === editingMovie.id) {
        return {
          ...movie,
          ...editForm
        }
      }
      return movie
    })

    localStorage.setItem('movies', JSON.stringify(updatedMovies))
    setIsEditModalOpen(false)
    window.location.reload()
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-white/5 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Modifier le film</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Nom</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 rounded"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block mb-1">Note</label>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setEditForm({...editForm, rating})}
                        className="text-4xl focus:outline-none"
                      >
                        <span className={`${rating <= editForm.rating ? 'text-yellow-500' : 'text-gray-500'}`}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className=""
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary rounded-full"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <div 
              className={`bg-black rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer border-2 border-transparent ${
                selectedMovie === movie.id ? 'border-white' : ''
              }`}
              onClick={() => setSelectedMovie(selectedMovie === movie.id ? null : movie.id)}
            >
              <button
                onClick={(e) => handleEditClick(movie, e)}
                className={`absolute top-2 right-12 text-red-500 hover:text-red-600 transition-colors z-10 bg-primary p-1.5 rounded-lg ${
                  selectedMovie === movie.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <PencilIcon size={20} stroke="#fff" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteMovie(movie.id)
                }}
                className={`absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors z-10 bg-primary p-1.5 rounded-lg ${
                  selectedMovie === movie.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <TrashIcon size={20} stroke="#fff" />
              </button>
              <div className="relative h-[300px] overflow-hidden">
                {movie.imageUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={movie.imageUrl}
                      alt={movie.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold mb-2 text-lg">{movie.name}</h3>
                  {selectedMovie === movie.id && (
                    <>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{movie.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < movie.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                          <span className="ml-1">{movie.rating}/5</span>
                        </div>
                        <Link to={`/movie/${movie.id}`} className="bg-primary px-2 py-1 text-xs rounded-lg">
                          <p>Voir details</p>
                        </Link>
                      </div>
                    </>
                  )}
                  {selectedMovie !== movie.id && (
                    <div className="flex items-center text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < movie.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieGrid