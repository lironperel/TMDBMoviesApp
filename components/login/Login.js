import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import NoPic from '../assets/nopic.png';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import UserAvatar from 'react-native-user-avatar';
import OAuthManager from 'react-native-oauth';
import {GOOGLE_CID, GOOGLE_CSECRET} from 'react-native-dotenv';
import LoginContext from '../config/LoginContext/LoginContext';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

const manager = new OAuthManager('MoonsiteMoviesApp');

manager.configure({
  google: {
    callback_url: `http://localhost/google`,
    client_id: GOOGLE_CID,
    client_secret: GOOGLE_CSECRET,
  },
});

const Login = ({navigation}) => {
  const loginContext = useContext(LoginContext);
  const loginState = loginContext.state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // runs only on mount, tries to login
    async function trySignIn() {
      if (!loginState.userSignedIn) {
        manager.savedAccounts().then((resp) => {
          if (resp.accounts.some((account) => account.provider === 'google')) {
            googleSignIn().then(() => setLoading(false));
          } else {
            getFBUserData();
            setLoading(false);
          }
          if (!loginState.userSignedIn) setLoading(false);
        });
      }
    }
    trySignIn();
  }, []);

  googleSignIn = async () => {
    await manager
      .authorize('google', {
        scopes: 'https://www.googleapis.com/auth/userinfo.profile',
      })
      .then(() => {
        const userInfoUrl =
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
        manager.makeRequest('google', userInfoUrl).then((resp) => {
          const [name, photoUrl] = [resp.data.name, resp.data.picture];
          loginContext.userLogIn(name, photoUrl);
          setLoading(false);
        });
      })
      .catch((err) => {
        return false;
      });

    return true;
  };

  const fbResponseInfoCallback = (error, result) => {
    if (!error) {
      const photoUrl = `https://graph.facebook.com/${result.id}/picture?type=large`;
      loginContext.userLogIn(result.name, photoUrl);
      setLoading(false);
    }
  };

  const getFBUserData = () => {
    // gets user name and photourl using fbResponseInfoCallback
    const infoRequest = new GraphRequest('/me', null, fbResponseInfoCallback);
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  fbSignIn = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken()
            .then(() => {
              getFBUserData();
            })
            .catch((err) => {
              return false;
            });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  return (
    <View style={styles.mainView}>
      {!loading && (
        <>
          <View style={styles.greeting}>
            <Text style={{fontSize: 24, marginBottom: 35}}>
              Welcome, {loginState.userSignedIn ? loginState.name : 'Guest'}
            </Text>
            {loginState.userSignedIn ? (
              <>
                <UserAvatar
                  style={{marginBottom: 30}}
                  size={150}
                  name={loginState.name}
                  src={loginState.photoUrl}
                />
                <TouchableOpacity
                  onPress={() => navigation.replace('Movies')}
                  style={{
                    ...styles.socialButton,
                    backgroundColor: '#b30cb3',
                  }}>
                  <FontAwesomeIcon
                    name="video-camera"
                    size={24}
                    color="white"
                  />
                  <Text style={{...styles.buttonText, fontSize: 18}}>
                    Click To Watch Our Movies
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Image style={{marginBottom: 20}} source={NoPic} />
                <Text style={{fontSize: 16}}>Please log in to continue</Text>
              </>
            )}
          </View>
          {!loginState.userSignedIn && (
            <View style={styles.loginButtonsView}>
              <TouchableOpacity
                onPress={() => fbSignIn()}
                style={{...styles.socialButton, backgroundColor: '#4267B2'}}>
                <FontAwesomeIcon name="facebook" size={24} color="white" />
                <Text style={styles.buttonText}>Login with Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => googleSignIn()}
                style={{...styles.socialButton, backgroundColor: '#dd4b39'}}>
                <FontAwesomeIcon name="google" size={24} color="white" />
                <Text style={styles.buttonText}>Login with Google</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainView: {
    paddingVertical: 30,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  socialButton: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
  },
  loginButtonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
