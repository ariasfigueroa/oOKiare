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
  Alert,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Firebase from '../lib/Firebase';
const {width, height} = Dimensions.get('window');

class KiareLogOut extends Component {

  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props){
    super(props);
    this.state = {
      email: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount(){
    AsyncStorage.getItem('user')
    .then((result)=>{
      if (result){
        var user = JSON.parse(result);
        this.setState({email: user.email});
      } else {
        console.log("No user in the storage");
      }
    })
    .catch((error)=>{
      console.log(error);
    });
  }

  _resetErrors(){
    if (this.state.errorMessage)
      this.setState({errorMessage: null})
  }

  logOut(){
    try{
      if (this.state.email){
        this.setState({
          showActivityIndicator: !this.state.showActivityIndicator
        });
        Firebase.logOut(()=>{
          Alert.alert('¡Graciasl!', 'Esperamos verte de regreso pronto.',  [ {text: 'Yes', onPress: () => {
          AsyncStorage.removeItem('user')
          .then((result)=>{
              this.setState({showActivityIndicator: !this.state.showActivityIndicator});
              this.goBack();
          })
          .catch((error)=>{
            console.log(error);
          });
          }, style: 'cancel'},], { cancelable: false });
        });
      } else {
        this.setState({errorMessage: 'Correo Electrónico es requerido.', showActivityIndicator: !this.state.showActivityIndicator});
      }
    } catch(error){
      this.setState({errorMessage: error.message, showActivityIndicator: !this.state.showActivityIndicator});
    }
  }

  goBack(){
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction)
  }

  render(){
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
      return(
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
                <View style={[styles.loginField]}>
                  {this.state.email ? <Text style={styles.errorMessageStyle}> {this.state.email} </Text> : null}
                </View>
              </View>

              <View style={styles.loginButtonContainer}>
                <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={this.logOut.bind(this)}
                >
                 <Text style={styles.textInsideButtons}>
                   Salir de mi perfil.
                 </Text>
                </TouchableOpacity>
              </View>

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

              {this.state.errorMessage ? <Text style={styles.errorMessageStyle}> {this.state.errorMessage} </Text> : null}
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
    width: width - 100,
    height:50,
    backgroundColor: "transparent",
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    width: width,
    height:50,
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
  textInsideButtons:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  errorMessageStyle: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: 'transparent',
  },
  headerImageContainer: {
    height: 50,
    }

});

export default KiareLogOut;
