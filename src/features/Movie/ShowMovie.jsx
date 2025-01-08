import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

function ShowMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");
    const foundMovie = movies.find((m) => m.id === Number(id));
    setMovie(foundMovie);

    const otherMovies = movies.filter((m) => m.id !== Number(id));
    const shuffled = otherMovies.sort(() => 0.5 - Math.random());
    setSuggestedMovies(shuffled.slice(0, 6));
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-[80vh]">
        <Link
          to="/"
          className="absolute top-8 left-8 z-30 inline-flex items-center text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2" size={24} />
          Retour
        </Link>

        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
          {movie.imageUrl ? (
            <img
              src={movie.imageUrl}
              alt={movie.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}

          <div className="absolute top-1/2 transform -translate-y-1/2 left-16 z-20 max-w-xl">
            <h1 className="text-[5rem] font-bold mb-4">{movie.name}</h1>
            <div className="flex items-center mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < movie.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-1">{movie.rating}/5</span>
            </div>
            <p className="text-lg text-gray-300">{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="px-12 py-8">
        <h1 className="text-2xl font-normal mb-6">J'aime également</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {suggestedMovies &&
            suggestedMovies.map((suggestedMovie) => (
              <Link
                key={suggestedMovie.id}
                to={`/movie/${suggestedMovie.id}`}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="aspect-[2/3] relative">
                  {suggestedMovie.imageUrl ? (
                    <img
                      src={suggestedMovie.imageUrl}
                      alt={suggestedMovie.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-semibold line-clamp-1">
                      {suggestedMovie.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500 text-xs">★</span>
                      <span className="ml-1 text-xs text-gray-300">
                        {suggestedMovie.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ShowMovie;
