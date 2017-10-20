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
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Firebase from '../lib/Firebase';

const {width, height} = Dimensions.get('window');

class RequestAccount extends Component {

  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  constructor(props){
    super(props);
    this.state = {
      userName: '',
      password: '',
      errorMessage: null,
      showActivityIndicator: false,
    }
    this._resetErrors = this._resetErrors.bind(this)
    this.goBack = this.goBack.bind(this);
  }

  _resetErrors(){
    if (this.state.errorMessage)
      this.setState({errorMessage: null})
  }

  componentWillMount(){

  }

  requestNewAccount(){
    try{
      if (this.state.userName && this.state.password ){
        this.setState({
          showActivityIndicator: !this.state.showActivityIndicator
        });
        let object = {email: this.state.userName, password: this.state.password, clienteKey: this.state.clienteKey, clienteNombre: this.state.cliente};
        Firebase.createUser(object, (user)=>{
          console.log('here');
          if (user){
            // Send request to create the account.
            object['key'] = user.uid;
            object['token'] = this.state.token;

            Firebase.requestNewAccount(object, ()=>{
              // success
              Alert.alert('Enviado', 'Solicitud enviada.', [ {text: 'OK', onPress: () => {
                Firebase.logOut(()=>{
                  this.setState({
                    showActivityIndicator: !this.state.showActivityIndicator
                  });
                  this.goBack();
                });
              }, style: 'cancel'}],  { cancelable: false });
            }, (error) => {
              // error
              this.setState({errorMessage: error, showActivityIndicator: !this.state.showActivityIndicator});
            });
          }else {
            this.setState({errorMessage: 'Usuario no creado.', showActivityIndicator: !this.state.showActivityIndicator});
          }
        }, (errorUser)=>{
          this.setState({errorMessage: errorUser, showActivityIndicator: !this.state.showActivityIndicator});
        });
      } else {
        this.setState({errorMessage: 'Correo Electrónico es requerido y Empresa son requeridos', showActivityIndicator: !this.state.showActivityIndicator});
      }
    } catch(error){
      this.setState({errorMessage: error.message, showActivityIndicator: !this.state.showActivityIndicator});
    }
  }

  goBack(){
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction)
  }

  componentDidMount(){

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
                  style={styles.logo}
                  source={require('../resources/images/kiare_logo_vertical.png')}
                />
              </View>
              <View style={styles.loginView}>
                <View style={[styles.loginField]}>
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


              <View style={styles.loginButtonContainer}>
                <TouchableOpacity style={styles.loginButtonStyle}
                  onPress={this.requestNewAccount.bind(this)}
                >
                 <Text style={styles.textInsideButtons}>
                   Solicitar Cuenta
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
    width: width - 40,
    height:100,
    backgroundColor: "rgba(255,255,255,0.80)",
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
    height: 50,
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
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: 'transparent',
  },
  dropdownStyle: {
    width: width - 100,
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  }

});

export default RequestAccount;
