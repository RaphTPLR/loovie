import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, HeartIcon } from "lucide-react";
import AddMovie from "./components/AddMovie";
import Button from "../../components/Button";
import axios from "axios";

const API_KEY = 'e7fecaf18d375e25b3d82f7d53c8ef97';



function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [movieToRate, setMovieToRate] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchMovies = async (page) => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/popular",
          {
            params: {
              api_key: API_KEY,
              language: "fr-FR",
              page: page,
            },
          }
        );
        setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      } catch (err) {
        console.error("Erreur lors de la récupération des films :", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      )
        return;
      setPage((prevPage) => prevPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleAddMovie = (newMovie) => {
    const savedMovies = localStorage.getItem("movies") || "[]";
    const currentMovies = JSON.parse(savedMovies);
    const updatedMovies = [...currentMovies, { ...newMovie, id: Date.now() }];
    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    setIsModalOpen(false);
  };

  const handleAddToWishlist = (movie) => {
    setMovieToRate(movie);
    setIsRatingModalOpen(true);
  };

  const saveMovieWithRating = () => {
    const savedMovies = localStorage.getItem("movies") || "[]";
    const currentMovies = JSON.parse(savedMovies);

    if (currentMovies.some((m) => m.id === movieToRate.id)) {
      return;
    }

    const movieToAdd = {
      id: movieToRate.id,
      name: movieToRate.title,
      description: movieToRate.overview,
      imageUrl: movieToRate.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieToRate.poster_path}`
        : null,
      rating: userRating || Math.round(movieToRate.vote_average / 2),
    };

    const updatedMovies = [...currentMovies, movieToAdd];
    localStorage.setItem("movies", JSON.stringify(updatedMovies));
    setIsRatingModalOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          Une erreur est survenue lors du chargement des films.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Films populaires</h1>
          <Button onClick={() => setIsModalOpen(true)} icon={<Heart />}>
            Ajouter un film
          </Button>
        </div>

        <AddMovie
          onAddMovie={handleAddMovie}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              {selectedMovie === movie.id && (
                <button
                  className="absolute top-2 right-2 z-10 bg-primary hover:bg-primary/80 text-white p-2 rounded-lg transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(movie);
                  }}
                >
                  <HeartIcon size={20} />
                </button>
              )}
              <div
                className={`bg-black rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer border-2 border-transparent ${
                  selectedMovie === movie.id ? "border-white" : ""
                }`}
                onClick={() =>
                  setSelectedMovie(selectedMovie === movie.id ? null : movie.id)
                }
              >
                <div className="relative h-[300px] overflow-hidden">
                  {movie.poster_path ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
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
                    <h3 className="font-semibold mb-2 text-lg">
                      {movie.title}
                    </h3>
                    {selectedMovie === movie.id && (
                      <>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {movie.overview}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.round(movie.vote_average / 2)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1">
                              {Math.round(movie.vote_average / 2)}/5
                            </span>
                          </div>
                          <Link
                            to={`/movie/${movie.id}`}
                            className="bg-primary px-2 py-1 text-xs rounded-lg"
                          >
                            <p>Voir details</p>
                          </Link>
                        </div>
                      </>
                    )}
                    {selectedMovie !== movie.id && (
                      <div className="flex items-center text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.round(movie.vote_average / 2)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
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

        {movies.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            Aucun film n'est disponible pour le moment.
          </p>
        )}

        {isRatingModalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-5 flex items-center justify-center z-50">
            <div className="bg-black p-8 w-[40vw] h-auto rounded-md">
              <h2 className="text-lg font-bold mb-4">Notez le film</h2>
              <div className="flex justify-center mb-4 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`cursor-pointer text-[4rem] ${
                      i < userRating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setUserRating(i + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="flex gap-4 w-full justify-end">
                <button
                  className="ml-2 text-white"
                  onClick={() => setIsRatingModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-full"
                  onClick={saveMovieWithRating}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;