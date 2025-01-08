import { useState, useEffect } from 'react'

function Profil() {
  const [movies, setMovies] = useState([])
  const [stats, setStats] = useState({
    totalMovies: 0,
    averageRating: 0,
    topRatedMovies: []
  })

  useEffect(() => {
    const savedMovies = localStorage.getItem('movies')
    const moviesData = savedMovies ? JSON.parse(savedMovies) : []
    setMovies(moviesData)

    const totalMovies = moviesData.length
    const averageRating = moviesData.length > 0
      ? (moviesData.reduce((sum, movie) => sum + Number(movie.rating), 0) / totalMovies).toFixed(1)
      : 0

    const topRatedMovies = [...moviesData]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)

    setStats({
      totalMovies,
      averageRating,
      topRatedMovies
    })
  }, [])

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div>
                <p className="">Nombre total de films</p>
                <p className="text-2xl font-bold">{stats.totalMovies}</p>
              </div>
              <div>
                <p className="">Note moyenne</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{stats.averageRating}</span>
                  <span className="text-yellow-500 ml-1 text-2xl">★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top 5 des films les mieux notés</h2>
          {stats.topRatedMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {stats.topRatedMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <div 
                    className={`bg-black rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer`}
                  >
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
                        <div className="flex items-center text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < movie.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                          <span className="ml-1">{movie.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Aucun film n'a été ajouté pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profil