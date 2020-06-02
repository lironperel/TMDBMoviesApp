import React, {Component} from 'react';
import MoviesContext from './MoviesContext';
import {TMDB_KEY} from 'react-native-dotenv';

class MoviesContextProvider extends Component {
  state = {
    movies: [],
    favMovies: [],
  };

  toggleMovieFav = (id) => {
    const movieIndex = this.state.movies.findIndex((movie) => movie.id === id);
    if (movieIndex > -1) {
      const newMovies = this.state.movies;
      newMovies[movieIndex].isFav = !newMovies[movieIndex].isFav;
      if (newMovies[movieIndex].isFav) {
        this.setState({
          movies: newMovies,
          favMovies: [...this.state.favMovies, id],
        });
      } else {
        this.setState({
          movies: newMovies,
          favMovies: this.state.favMovies.filter((movieid) => movieid !== id),
        });
      }
    }
  };

  checkIfMovieIsFav = (id) => {
    return this.state.favMovies.includes(id);
  };

  getMovieDetailsById = async (movieId) => {
    try {
      let response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&language=en-US`,
      );
      let json = await response.json();
      let movie = {
        id: json.id,
        title: json.title,
        posterPath: `https://image.tmdb.org/t/p/w185${json.poster_path}`,
        year: json.release_date.substring(0, 4),
        overview: json.overview,
        vote_average: json.vote_average,
        isFav: this.checkIfMovieIsFav(json.id),
      };

      return movie;
    } catch (error) {
      return null;
    }
  };

  getMoviesFromApi = async (page) => {
    try {
      let response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`,
      );
      let json = await response.json();
      let movies = json.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          posterPath: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
          year: movie.release_date.substring(0, 4),
          isFav: this.checkIfMovieIsFav(json.id),
        };
      });
      this.setState(
        {
          movies: page === 1 ? movies : [...this.state.movies, ...movies],
        },
        () => {
          return true;
        },
      );
    } catch (error) {
      return false;
    }
  };

  render() {
    return (
      <MoviesContext.Provider
        value={{
          state: this.state,
          getMoviesFromApi: this.getMoviesFromApi,
          getMovieDetailsById: this.getMovieDetailsById,
          toggleMovieFav: this.toggleMovieFav,
        }}>
        {this.props.children}
      </MoviesContext.Provider>
    );
  }
}
export default MoviesContextProvider;
