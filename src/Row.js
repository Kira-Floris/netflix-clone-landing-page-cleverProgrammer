import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import defaultImage from "./netflix.jpg";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerURl] = useState("");

  useEffect(() => {
    // [] means run once when the row loads on page load
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); //every dependency in the useEffect that mignt change, must be added to the empty array at the end
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1
    }
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerURl("");
    } else {
      movieTrailer(movie?.name || movie?.original_name || movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(URL(url).search);
          setTrailerURl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>
      {/* container -> posters */}
      <div className="row__posters">
        {/* several row posters */}
        {movies.map((movie) => {
          const image_url = `${base_url}${
            isLargeRow ? movie.poster_path : movie.backdrop_path
          }`;
          // const image = image_url && image_url
          return (
            <img
              key={movie.id}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={image_url}
              alt={movie.name}
              onClick={() => handleClick(movie)}
            />
          );
        })}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
