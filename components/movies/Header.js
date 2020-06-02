import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Logo from '../assets/logo.png';
import LoginContext from '../config/LoginContext/LoginContext';
import MoviesContext from '../config/MoviesContext/MoviesContext';
import UserAvatar from 'react-native-user-avatar';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IconBadge from 'react-native-icon-badge';

const Header = (props) => {
  const navigation = props.navigation;
  const loginContext = useContext(LoginContext);
  const moviesContext = useContext(MoviesContext);
  const loginState = loginContext.state;
  const [badgeCount, setBadgeCount] = useState(
    moviesContext.state.favMovies.length,
  );

  useEffect(() => {
    // every time favorites amount changes, update badge counter
    setBadgeCount(moviesContext.state.favMovies.length);
  }, [moviesContext.state.favMovies.length]);

  return (
    <View style={styles.mainView}>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
        <IconBadge
          MainElement={
            <FontAwesomeIcon
              name={'star'}
              size={36}
              color="#f7b01a"
              style={{margin: 5}}
            />
          }
          BadgeElement={<Text style={{color: '#FFFFFF'}}>{badgeCount}</Text>}
          IconBadgeStyle={{
            top: 26,
            right: 0,
            width: 18,
            height: 18,
            backgroundColor: 'red',
          }}
          Hidden={badgeCount == 0}
        />
      </TouchableOpacity>

      <View style={styles.logo}>
        <Image source={Logo} />
      </View>
      <UserAvatar size={50} name={loginState.name} src={loginState.photoUrl} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateX: 5}],
  },
});
