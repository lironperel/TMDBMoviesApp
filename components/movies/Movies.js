import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import MoviesContext from '../config/MoviesContext/MoviesContext';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Movies = ({navigation}) => {
  return <MoviesList />;
};

const MoviesList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);
  const moviesContext = useContext(MoviesContext);

  const handleLoadMore = (page) => {
    if (page === 1) {
      setLoading(true);
    }
    if (
      moviesContext.getMoviesFromApi(page).then(() => {
        if (page === 1) {
          setLoading(false);
        }
      })
    ) {
      setpage(page + 1);
    }
  };

  const handleSelected = (movieId) => {
    setSelectedMovieId(movieId);
    setModalVisible(true);
  };

  useEffect(() => {
    //runs once, on component mount
    if (moviesContext.getMoviesFromApi(page)) {
      setpage(page + 1);
      setLoading(false);
    }
  }, []);

  const renderFooter = () => {
    // shows indicator at the bottom of the list
    // if (!loading) return null;
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', height: 100}}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  };

  if (modalVisible) {
    return (
      <SafeAreaView style={styles.moviesView}>
        <MovieModal
          modalVisible
          selectedMovieId={selectedMovieId}
          setModalVisible={setModalVisible}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.moviesView}>
      {!loading && (
        <FlatList
          data={moviesContext.state.movies}
          extraData={moviesContext.state.movies}
          renderItem={({item: movie}) => (
            <Movie
              id={movie.id}
              title={movie.title}
              year={movie.year}
              posterPath={movie.posterPath}
              selectMovie={handleSelected}
              isFav={movie.isFav}
              toggleFav={moviesContext.toggleMovieFav.bind(movie.id)}
            />
          )}
          numColumns={2}
          keyExtractor={(i) => i.id}
          onEndReached={() => handleLoadMore(page)}
          ListFooterComponent={() => renderFooter()}
          onEndThreshold={0}
        />
      )}
      {loading && page === 1 && <ActivityIndicator size="large" color="gray" />}
    </SafeAreaView>
  );
};

class Movie extends React.PureComponent {
  // used PureComponent for better performence
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.selectMovie(this.props.id)}
        style={styles.movieCard}>
        <ImageBackground
          style={{width: '100%', height: 250, borderRadius: 10}}
          imageStyle={{borderRadius: 10, resizeMode: 'cover'}}
          source={{uri: this.props.posterPath}}>
          <FontAwesomeIcon
            name={this.props.isFav ? 'star' : 'star-o'}
            size={36}
            backgroundColor="transparent"
            color="#f7b01a"
            style={{margin: 10}}
            onPress={() => this.props.toggleFav(this.props.id)}
          />
        </ImageBackground>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontWeight: 'bold',
            fontSize: 24,
            textAlign: 'center',
          }}>
          {this.props.title}
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center'}}>
          {this.props.year}
        </Text>
      </TouchableOpacity>
    );
  }
}

const getMovieDetails = async (context, id) => {
  const movie = await context.getMovieDetailsById(id);
  return movie;
};

const MovieModal = (props) => {
  const movieContext = useContext(MoviesContext);
  const {selectedMovieId, modalVisible, setModalVisible} = props;
  const [selectedMovieData, setSelectedMovieData] = useState({});

  useEffect(() => {
    getMovieDetails(movieContext, selectedMovieId).then((movie) =>
      setSelectedMovieData(movie),
    );
  }, []);

  return (
    <Modal animationType="slide" statusBarTranslucent visible={modalVisible}>
      {selectedMovieData ? (
        <View
          style={{
            flex: 1,
            marginTop: 40,
            margin: 20,
            padding: 20,
            borderWidth: 0.5,
            borderRadius: 10,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
              width: 40,
              right: 0,
              top: 5,
              padding: 3,
            }}
            onPress={() => {
              setModalVisible(false);
            }}>
            <FontAwesomeIcon name="close" size={30} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 260,
            }}>
            <Image
              style={{
                height: 250,
                width: 160,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
              source={{uri: selectedMovieData.posterPath}}
            />
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                alignContent: 'flex-start',
                marginLeft: 20,
              }}>
              <Text
                numberOfLines={4}
                style={{
                  fontWeight: 'bold',
                  fontSize: 24,
                  marginRight: 18,
                }}>
                {selectedMovieData.title}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                }}>
                {selectedMovieData.year}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 28,
                  color: '#f7b01a',
                }}>
                {selectedMovieData.vote_average}
                <Text style={{color: '#000', fontSize: 16}}>/10</Text>
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    selectedMovieData.isFav = !selectedMovieData.isFav;
                    movieContext.toggleMovieFav(selectedMovieData.id);
                  }}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '60%',
                  }}>
                  <FontAwesomeIcon
                    name={selectedMovieData.isFav ? 'star' : 'star-o'}
                    size={36}
                    color="#f7b01a"
                    style={{margin: 5}}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                    }}>
                    {selectedMovieData.isFav
                      ? 'Remove from favorites'
                      : 'Add to favorites'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView style={{marginTop: 10}}>
            <Text style={{fontSize: 18, textAlign: 'justify'}}>
              {selectedMovieData.overview}{' '}
            </Text>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 40,
            margin: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: 'gray',
          }}>
          <Text>Error getting movie details...</Text>
          <TouchableHighlight
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text>X</Text>
          </TouchableHighlight>
        </View>
      )}
    </Modal>
  );
};

export default Movies;

const styles = StyleSheet.create({
  moviesView: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieCard: {
    width: '50%',
    padding: 10,
  },
});
