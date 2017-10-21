import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  AppRegistry,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
  Alert
} from 'react-native';

import Firebase from '../lib/Firebase';
import { StackNavigator, NavigationActions } from 'react-navigation';
import CachedImage from 'react-native-cached-image';
import Icon from 'react-native-vector-icons/Entypo';

const {width, height} = Dimensions.get('window');

class KiareLogIn extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      errorMessage: null,
      showActivityIndicator: true,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this.goBack = this.goBack.bind(this);
  }

  _resetErrors(){
    if (this.state.errorMessage)
      this.setState({errorMessage: null})
  }

  login(){
    try {
      if (this.state.userName && this.state.password){
        this.setState({showActivityIndicator: !this.state.showActivityIndicator});
        Firebase.loginWithEmail(this.state.userName, this.state.password , (User)=>{
          console.log('user logged: ', User.uid);
          AsyncStorage.setItem('userUid', User.uid);
          Alert.alert('¡Genial!', 'Bienvenido a Kiare',  [ {text: 'Yes', onPress: () => {
            this.setState({showActivityIndicator: !this.state.showActivityIndicator});
            this.goBack();
          }, style: 'cancel'},], { cancelable: false });
        }, (errorMessage)=>{
          console.log(errorMessage);
          this.setState({errorMessage: errorMessage.message, showActivityIndicator: !this.state.showActivityIndicator})
        });
      } else {
        this.setState({errorMessage: 'Correo Eletrónico y Contraseña requeridos.', showActivityIndicator: !this.state.showActivityIndicator});
      }
    } catch (error) {
      this.setState({errorMessage: error.message, showActivityIndicator: !this.state.showActivityIndicator});
    }
  }

  goBack(){
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction)
  }

  componentDidMount(){
    AsyncStorage.getItem('userUid')
    .then((result)=>{
      if (result){
        console.log(result);
      } else {
        console.log("userUid is null, means the user is no logged");
      }
      this.setState({showActivityIndicator: !this.state.showActivityIndicator});
    })
    .catch((error)=>{
      console.log(error);
      this.setState({showActivityIndicator: !this.state.showActivityIndicator});
    });
  }

  render() {
    if (this.state.showActivityIndicator){
      return(
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
          <Image
            style={styles.backgroundImage}
            source={require('../resources/images/fondo_nuevo.png')}
          />
          <View style={styles.containerAbsolute}>
            <ActivityIndicator
              animating={this.state.showActivityIndicator}
              style={{height: 80}}
              size="large"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
          <Image
            style={styles.backgroundImage}
            source={require('../resources/images/fondo_nuevo.png')}
          />
          <KeyboardAvoidingView
            behavior='padding'
            style={styles.containerAbsolute}
          >

            <View style={styles.textInputViewStyle}>
              <View style={styles.logoView}>
                <Image
                  resizeMode={'contain'}
                  style={styles.headerImageContainer}
                  source={require('../resources/images/kiare_logo_vertical.png')}
                />
              </View>
              <View style={styles.loginView}>
                <View style={[styles.loginField, styles.loginDivisor]}>
                  <TextInput style={styles.textInputStyle}
                     autoCapitalize= {'none'}
                     autoCorrect={false}
                     placeholder= {'Correo Electrónico'}
                     onChangeText={(userName) => this.setState({userName})}
                     returnKeyType={'next'}
                     keyboardType={'email-address'}
                     ref={(userNameInput) => this.userNameInput = userNameInput}
                     onSubmitEditing={() => this.passwordInput.focus()}
                     value={this.state.userName}
                     onFocus={this._resetErrors}
                  />
                </View>
                <View style={[styles.loginField]}>
                  <TextInput style={styles.textInputStyle}
                    autoCapitalize= {'none'}
                    autoCorrect={false}
                    placeholder= {'Contraseña'}
                    onChangeText={(password) => this.setState({password})}
                    returnKeyType={'go'}
                    secureTextEntry={true}
                    keyboardType={'default'}
                    ref={(passwordInput) => this.passwordInput = passwordInput}
                    value={this.state.password}
                    onFocus={this._resetErrors}
                  />
                </View>
              </View>
              <View style={styles.forgotPasswordButtonStyle}>
                <TouchableOpacity
                  onPress={()=>{
                    const { navigate } = this.props.navigation;
                    navigate('ResetPassword');
                  }
                }>
                  <Text style={styles.textButtons}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.loginButtonContainer}>
                <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={this.login.bind(this)}
                >
                 <Text style={styles.textInsideButtons}>
                   Iniciar Sesión
                 </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.forgotPasswordButtonStyle}>
                <TouchableOpacity
                  onPress={()=>{
                  const { navigate } = this.props.navigation;
                  navigate('RequestAccount');
                  }
                }>
                  <Text style={styles.textInsideButtons}>
                    No tengo cuenta, solicitar una.
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.facebookButtonContainer}>
                <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={() => {

                  }}
                >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  }}>
                  <Icon
                    name="facebook-with-circle"
                    size={30}
                    color="#3b5998"
                  />
                  <Text style={styles.textInsideFacebookButtons}>
                    Facebook
                  </Text>
                </View>

                </TouchableOpacity>
              </View>
              {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
              <View style={styles.forgotPasswordButtonStyle}>
                <TouchableOpacity
                  onPress={()=>{
                    this.goBack();
                  }
                }>
                  <Text style={styles.textInsideButtons}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
              </View>
            </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  backgroundImage:{
    width,
    height,
  },
  containerAbsolute:{
    position: 'absolute',

  },
  textInputViewStyle:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    height: 40,
    paddingLeft: 10,
  },
  loginView: {
    width: width - 40,
    height:100,
    backgroundColor: "rgba(255,255,255,0.80)",
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    width: 180,
    height:100,
    backgroundColor: "transparent",
    borderRadius: 10,
    marginBottom: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 162,
    height: 90,
  },
  loginField:{
    backgroundColor: 'transparent',
    width: width - 100,
    height:40,
    borderRadius: 5,
  },
  loginDivisor:{
    borderBottomWidth: 0.3,
  },
  forgotPasswordButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textButtons: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '400',
    backgroundColor: 'transparent',
  },
  loginButtonContainer:{
    width: width - 100,
    height:44,
    backgroundColor: '#462248',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  facebookButtonContainer:{
    width: width - 100,
    height:44,
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  textInsideButtons:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  textInsideFacebookButtons:{
    color: '#3b5998',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginLeft: 20,
  },
  errorMessageStyle: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: 'transparent',
  },
  headerImageContainer: {
    height: 50,
    }

});

export default KiareLogIn;
