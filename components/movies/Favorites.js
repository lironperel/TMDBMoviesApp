import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, SafeAreaView, FlatList} from 'react-native';
import MoviesContext from '../config/MoviesContext/MoviesContext';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Favorites = () => {
  const moviesContext = useContext(MoviesContext);
  const [favMovies, setFavMovies] = useState([]);

  useEffect(() => {
    setFavMovies(moviesContext.state.favMovies);
  }, [moviesContext.state.favMovies]);

  return (
    <SafeAreaView style={styles.mainView}>
      {favMovies.length > 0 ? (
        <FlatList
          data={favMovies}
          extraData={favMovies}
          renderItem={({item: movieId}) => <FavoriteMovie id={movieId} />}
          keyExtractor={(i) => i.toString()}
        />
      ) : (
        <Text style={styles.noFavsText}>No Favorite Movies</Text>
      )}
    </SafeAreaView>
  );
};

class FavoriteMovie extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      title: '',
    };
  }
  static contextType = MoviesContext;

  componentDidMount() {
    const movieIndex = this.context.state.movies.findIndex(
      (movie) => movie.id === this.props.id,
    );

    if (movieIndex > -1) {
      this.setState({
        id: this.context.state.movies[movieIndex].id,
        title: this.context.state.movies[movieIndex].title,
      });
    }
  }
  render() {
    return (
      <View style={styles.favMovieView}>
        <EntypoIcon
          style={{marginRight: 20}}
          name="folder-video"
          size={36}
          color="#f7b01a"
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <Text style={styles.favmovieTitle} numberOfLines={1}>
            {this.state.title}
          </Text>
        </View>
        <FontAwesomeIcon
          onPress={() => this.context.toggleMovieFav(this.state.id)}
          name="remove"
          size={36}
          color="#843232"
        />
      </View>
    );
  }
}

export default Favorites;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  noFavsText: {
    fontSize: 20,
    marginTop: 30,
    color: 'darkgray',
    textAlign: 'center',
  },
  favMovieView: {
    height: 80,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favmovieTitle: {
    flex: 1,
    marginRight: 5,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
