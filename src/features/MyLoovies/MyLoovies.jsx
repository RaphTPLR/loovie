import { useState, useRef } from 'react'
import { TrashIcon } from 'lucide-react'
import MovieCarousel from './components/MovieCarousel'
import MovieGrid from './components/MovieGrid'
import Button from '../../components/Button'

function MyLoovies() {
  const [allMovies, setAllMovies] = useState(() => {
    const savedMovies = localStorage.getItem('movies')
    return savedMovies ? JSON.parse(savedMovies) : []
  })

  const [selectedRecentMovie, setSelectedRecentMovie] = useState(null)
  const [selectedTopRatedMovie, setSelectedTopRatedMovie] = useState(null)
  const recentCarouselRef = useRef(null)
  const topRatedCarouselRef = useRef(null)

  const recentMovies = [...allMovies]
    .sort((a, b) => b.id - a.id)
    .slice(0, 10)

  const topRatedMovies = [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)

  const handleScroll = (direction, carouselRef) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleDeleteMovie = (movieId) => {
    const updatedMovies = allMovies.filter(movie => movie.id !== movieId)
    setAllMovies(updatedMovies)
    localStorage.setItem('movies', JSON.stringify(updatedMovies))

    if (selectedRecentMovie === movieId) setSelectedRecentMovie(null)
    if (selectedTopRatedMovie === movieId) setSelectedTopRatedMovie(null)
  }

  const handleClearStorage = () => {
    localStorage.removeItem('movies')
    setAllMovies([])
    setSelectedRecentMovie(null)
    setSelectedTopRatedMovie(null)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Mes Loovies
          </h1>
          <Button
            onClick={handleClearStorage}
            icon={<TrashIcon size={20} />}
            variant="danger"
          >
            Vider ma liste
          </Button>
        </div>

        {allMovies.length > 0 ? (
          <>
            <MovieCarousel 
              movies={recentMovies} 
              carouselRef={recentCarouselRef}
              title="Mes films les plus récents"
              selectedMovieId={selectedRecentMovie}
              setSelectedMovieId={setSelectedRecentMovie}
              handleScroll={handleScroll}
              onDeleteMovie={handleDeleteMovie}
            />
            <MovieCarousel 
              movies={topRatedMovies} 
              carouselRef={topRatedCarouselRef}
              title="Mes films les plus aimés"vi
              selectedMovieId={selectedTopRatedMovie}
              setSelectedMovieId={setSelectedTopRatedMovie}
              handleScroll={handleScroll}
              onDeleteMovie={handleDeleteMovie}
            />
            <MovieGrid 
              movies={allMovies}
              title="Tous mes films"
              onDeleteMovie={handleDeleteMovie}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <p className="text-gray-500 text-xl mb-4">
              Vous n'avez pas encore ajouté de films à votre liste
            </p>
            <p className="text-gray-400">
              Ajoutez des films depuis la page d'accueil pour les voir apparaître ici
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyLoovies
