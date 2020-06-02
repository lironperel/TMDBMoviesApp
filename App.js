import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import Login from './components/login/Login';
import Movies from './components/movies/Movies';
import Header from './components/movies/Header';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginContextProvider from './components/config/LoginContext/LoginContextProvider';
import MoviesContextProvider from './components/config/MoviesContext/MoviesContextProvider';
import Favorites from './components/movies/Favorites';

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <MoviesContextProvider>
        <LoginContextProvider>
          <NavigationContainer>
            <SafeAreaView style={styles.mainView}>
              <StatusBar backgroundColor="white" barStyle="dark-content" />
              <Stack.Navigator>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Movies"
                  component={Movies}
                  options={{
                    header: ({navigation}) => (
                      <Header navigation={navigation} />
                    ),
                  }}
                />
                <Stack.Screen
                  name="Favorites"
                  component={Favorites}
                  options={{
                    headerTitle: 'My Favorite Movies',
                    headerStyle: {
                      height: 80,
                      elevation: 0, // remove shadow on Android
                      shadowOpacity: 0, // remove shadow on iOS
                    },
                  }}
                />
              </Stack.Navigator>
            </SafeAreaView>
          </NavigationContainer>
        </LoginContextProvider>
      </MoviesContextProvider>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
});

export default App;
