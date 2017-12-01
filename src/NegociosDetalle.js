import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Linking,
  Alert,
  AsyncStorage,
  Share,
} from 'react-native';



import Firebase from '../lib/Firebase';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions } from 'react-navigation';
import Swiper from 'react-native-swiper';
import CachedImage from 'react-native-cached-image';
import Communications from 'react-native-communications';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

import ActionButton from 'react-native-circular-action-menu';
import Moment from 'moment';
import localization from 'moment/locale/es'
import 'moment-timezone';

const {width, height} = Dimensions.get('window');
const scaleAnimation = new ScaleAnimation();

class NegociosDetalle extends Component{

  static navigationOptions = ({ navigation }) => ({
    header: null,
    // headerTitle: navigation.state.params.data.nombre,
    // headerRight: (
    //   <View style={{flexDirection: 'row', marginRight: 20, alignItems: 'flex-end'}}>
    //   {navigation.state.params.data.telefono ? (
    //     <TouchableOpacity
    //       onPress={() => {
    //         Alert.alert('Enlazar llamada', 'Te comunicaremos al: ' + navigation.state.params.data.telefono,  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
    //           // Here goes to code to call
    //           Communications.phonecall(navigation.state.params.data.telefono, false);
    //         }},],  { cancelable: false });
    //         }
    //       }
    //     >
    //     <View>
    //       <Ionicons
    //         name="ios-call"
    //         size={20}
    //         color="rgba(207, 187, 164, 1.0)"
    //       />
    //     </View>
    //     </TouchableOpacity>
    //   ) : null}
    //
    //   {navigation.state.params.distancia ? (
    //     <TouchableOpacity
    //     style={{marginLeft: 20}}
    //       onPress={()=>{
    //         Alert.alert('¡Oye!', 'Te enviaremos a una app externa de Mapas. ¿Estás de acuerdo?',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
    //           var url = null;
    //           let coordenates = navigation.state.params.data.latitud + ','+ navigation.state.params.data.longitud;
    //           let dirflg = '&dirflg=d'
    //           if (Platform.OS === 'android'){
    //             // here goes the call to open the google maps
    //             url = 'geo:';
    //           } else {
    //             // her goes the call to open Apple maps
    //             url = 'http://maps.apple.com/?daddr=';
    //           }
    //           Linking.openURL(url+coordenates+dirflg);
    //         }},],  { cancelable: false });
    //       }
    //     }
    //     >
    //       <View>
    //         <Icon
    //           name="location"
    //           size={20}
    //           color="rgba(207, 187, 164, 1.0)"
    //         />
    //       </View>
    //     </TouchableOpacity>
    //   ) : null}
    //
    //   {navigation.state.params.data.web ? (
    //     <TouchableOpacity
    //       style={{marginLeft: 20}}
    //       onPress={null}
    //     >
    //       <MaterialCommunityIcons
    //         name="web"
    //         size={20}
    //         color="rgba(207, 187, 164, 1.0)"
    //       />
    //     </TouchableOpacity>
    //   ) : null}
    // </View>),
    // headerLeft: (<TouchableOpacity
    //   onPress={()=>{
    //                 const backAction = NavigationActions.back();
    //                 navigation.dispatch(backAction);
    //               }
    //           }>
    //           <View style={{paddingLeft: 20}}>
    //             <Icon
    //               name= "back"
    //               color= "#CFBBA4"
    //               size={20}
    //             />
    //           </View>
    // </TouchableOpacity>),

  });


    constructor(props){
      super(props);
      this.state = {
        masInformacionData: [],
        userUid: null,
        colorFavorite: '#F8C029',
      }


      this.scaleAnimationPromo = this.scaleAnimationPromoDialog.bind(this);
      this.scaleAnimationService = this.scaleAnimationServiceDialog.bind(this);
      this.scaleAnimationSugerencia = this.scaleAnimationSugerenciaDialog.bind(this);

      console.log(':::::::::::::: Constructor: '+this.props.navigation.state.params.data.nombre);
      console.log('Detalle->orderByCategory: ' +this.props.navigation.state.params.categoryName + ' : '+this.props.navigation.state.params.subcategoryName);
    }

    componentWillMount(){
      AsyncStorage.getItem('user')
      .then((result)=>{
        if (result){
          var user = JSON.parse(result);
          this.setState({userUid: user.uid});
          Firebase.isBusinessFavorite('/users/'+user.uid+'/negocios/favoritos/',this.props.navigation.state.params.data.key, () => {
              this.setState({colorFavorite: '#CE267A'});
          }, (error) => {
            console.log(error);
          });
        } else {
          console.log("userUid is null, means the user is no logged");
        }
      })
      .catch((error)=>{
        console.log(error);
      });
    }

    formatHours(horario){
      let splitter = horario.toString().split('.');
      if (splitter.length === 1) {
         return (splitter[0] + ':00');
      } else {
        return (splitter[0] + ':' + splitter[1]+'0');
      }
    }

    formatShareHorario(){
      var shareHorario = '';
      if (this.props.navigation.state.params.categoryName === 'EVENTOS' ||
          (this.props.navigation.state.params.categoryName === 'CULTURA' &&
           this.props.navigation.state.params.subcategoryName === 'EVENTOS CULTURALES') ||
          (this.props.navigation.state.params.categoryName === 'DEPORTES' &&
           (this.props.navigation.state.params.subcategoryName === 'CARRERAS ATLÉTICAS' ||
            this.props.navigation.state.params.subcategoryName === 'EVENTO DEPORTIVO'))) {

        if (this.props.navigation.state.params.data.fechaEvento){
         shareHorario = Moment(this.props.navigation.state.params.data.fechaEvento).locale('es', localization).format('LLL');
        }
      } else {
       shareHorario =' Domingo: '+this.formatHours(this.props.navigation.state.params.data.horarios[0].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[0].cer)+
                    '\n Lunes: '+this.formatHours(this.props.navigation.state.params.data.horarios[1].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[1].cer)+
                    '\n Martes: '+this.formatHours(this.props.navigation.state.params.data.horarios[2].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[2].cer)+
                    '\n Miércoles: '+this.formatHours(this.props.navigation.state.params.data.horarios[3].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[3].cer)+
                    '\n Jueves: '+this.formatHours(this.props.navigation.state.params.data.horarios[4].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[4].cer)+
                    '\n Viernes: '+this.formatHours(this.props.navigation.state.params.data.horarios[5].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[5].cer)+
                    '\n Sábado: '+this.formatHours(this.props.navigation.state.params.data.horarios[6].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[6].cer);
      }
      return shareHorario;
    }

    formatPromociones() {
     if (this.props.navigation.state.params.data.promos){
       return '\n\nPromociones: \n '+ this.props.navigation.state.params.data.promos;
     } else {
       return '';
     }
    }

    scaleAnimationPromoDialog() {
      this.scaleAnimationDialog.show();
    }

    scaleAnimationServiceDialog() {
      this.scaleAnimationServiceDialog.show();
    }

    scaleAnimationSugerenciaDialog() {
      this.scaleAnimationSugerenciaDialog.show();
    }

    _sendMeToMaps(latitudeDelta, longitudeDelta){
      Alert.alert('¡Oye!', 'Te enviaremos a una app externa de Mapas. ¿Estás de acuerdo?',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
        var url = null;
        let coordenates = latitudeDelta + ','+ longitudeDelta
        if (Platform.OS === 'android'){
          // here goes the call to open the google maps
          url = 'geo:';
        } else {
          // her goes the call to open Apple maps
          url = 'http://maps.apple.com/?ll=';
        }
        Linking.openURL(url+coordenates);
      }},],  { cancelable: false });
    }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <Image source={require('../resources/images/fondo_nuevo.png')}/>
        <PopupDialog
            ref={(popupDialog) => {
              this.scaleAnimationDialog = popupDialog;
            }}
            width={width - 40}
            dialogAnimation={scaleAnimation}
            dialogTitle={<DialogTitle title="Promos" />}
            actions={[
              <DialogButton
                text="Cerrar"
                onPress={() => {
                  this.scaleAnimationDialog.dismiss();
                }}
                key="button-1"
              />,
            ]}
            >
            <View style={styles.dialogContentView}>
              <MaterialCommunityIcons
                name= "sale"
                size={40}
                color="#EC573B"
              />
              <Text>{this.props.navigation.state.params.data.promos ? this.props.navigation.state.params.data.promos : 'No hay promo...'}</Text>
            </View>
        </PopupDialog>

        <PopupDialog
            ref={(popupDialog) => {
              this.scaleAnimationServiceDialog = popupDialog;
            }}
            width={width - 40}
            dialogAnimation={scaleAnimation}
            dialogTitle={<DialogTitle title="Servicios" />}
            actions={[
              <DialogButton
                text="Cerrar"
                onPress={() => {
                  this.scaleAnimationServiceDialog.dismiss();
                }}
                key="button-1"
              />,
            ]}
            >
            <View style={styles.dialogContentView}>
              <MaterialIcons
                name= "room-service"
                size={40}
                color="#F8C029"
              />
              <Text>{this.props.navigation.state.params.data.servicios ? this.props.navigation.state.params.data.servicios : 'No hay servicios...'}</Text>
            </View>
        </PopupDialog>

        <PopupDialog
            ref={(popupDialog) => {
              this.scaleAnimationSugerenciaDialog = popupDialog;
            }}
            width={width - 40}
            dialogAnimation={scaleAnimation}
            dialogTitle={<DialogTitle title="Sugerencia" />}
            actions={[
              <DialogButton
                text="Cerrar"
                onPress={() => {
                  this.scaleAnimationSugerenciaDialog.dismiss();
                }}
                key="button-1"
              />,
            ]}
            >
            <View style={styles.dialogContentView}>
              <Icon
                name= "medal"
                size={40}
                color="#88A451"
              />
              <Text>{this.props.navigation.state.params.data.sugerencia ? this.props.navigation.state.params.data.sugerencia : 'No hay sugerencia...'}</Text>
            </View>
        </PopupDialog>

        <View style={styles.containerAbsolute}>
          <View style={styles.headerContainer}>
            <Image resizeMode={'contain'} style={styles.headerImageContainer} source={require('../resources/images/kiare_logo_vertical.png')}/>
          </View>
          <ScrollView>
            <View style={{marginLeft: 20,}}>
            <View>
            <View style={styles.verticalAligning}>
              <View style={styles.logoImageStyle}>
                <CachedImage resizeMode={'cover'} style={styles.logoImageSizeStyle} source={{uri: this.props.navigation.state.params.data.imagenUrl}}/>
              </View>
              <View style={styles.buttonsBusinessContainer}>
              {this.props.navigation.state.params.data.promos ? (<TouchableOpacity
                onPress={this.scaleAnimationPromo}
              >
                <View style={styles.buttonBusinessStyle}>
                  <MaterialCommunityIcons
                    name= "sale"
                    size={40}
                    color="#EC573B"
                  />
                  <Text style={styles.smallText}>Promos</Text>
                </View>
              </TouchableOpacity>) : null}
              {this.props.navigation.state.params.data.servicios ? (
                <TouchableOpacity
                  onPress={this.scaleAnimationService}
                >
                  <View style={styles.buttonBusinessStyle}>
                  <MaterialIcons
                    name= "room-service"
                    size={40}
                    color="#F8C029"
                  />
                  <Text style={styles.smallText}>Servicios</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {this.props.navigation.state.params.data.sugerencia ? (
                <TouchableOpacity
                  onPress={this.scaleAnimationSugerencia}
                >
                  <View style={styles.buttonBusinessStyle}>
                    <Icon
                      name= "medal"
                      size={40}
                      color="#88A451"
                    />
                    <Text style={styles.smallText}>Sugerencia</Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              </View>
            </View>

            <View style={styles.horizontalBar}>
              <TouchableOpacity
                style={{marginHorizontal: 20}}
                onPress={() => {
                  Alert.alert('Enlazar llamada', 'Te comunicaremos al: ' + this.props.navigation.state.params.data.telefono,  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
                    // Here goes to code to call
                    Communications.phonecall(this.props.navigation.state.params.data.telefono, false);
                  }},],  { cancelable: false });
                  }
                }
              >
                <Ionicons
                  name="ios-call"
                  size={40}
                  color="#EC573B"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginHorizontal: 20}}
                onPress={() =>{
                  if (this.state.userUid){
                     if (this.state.colorFavorite === '#CE267A') {
                       Firebase.removeBussinessFavorites('/users/'+this.state.userUid+'/negocios/favoritos/',this.props.navigation.state.params.data.key);
                       this.setState({colorFavorite: '#F8C029'});
                       Alert.alert('Favoritos', 'Eliminado de favoritos.');
                     } else {
                       Firebase.setBussinessFavorites('/users/'+this.state.userUid+'/negocios/favoritos/',this.props.navigation.state.params.data.key);
                       this.setState({colorFavorite: '#CE267A'});
                       Alert.alert('Favoritos', 'Agregado a favoritos.');
                    }
                  } else {
                     Alert.alert('Favoritos', 'Necesitas estar loggeado para agregar negocios como favoritos.');
                  }
                }}
              >
                <MaterialCommunityIcons
                  name="heart"
                  size={40}
                  color={this.state.colorFavorite}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginHorizontal: 20}}
                onPress={() =>{
                  Share.share({
                                message: 'Kiare hoy en: \n   '+this.props.navigation.state.params.data.nombre +
                                         '\n\nHorarios: '+
                                         '\n'+this.formatShareHorario() +
                                         this.formatPromociones() +
                                         '\n\n¡ Si aún no tienes Kiare descargala desde google play !'+
                                         '\n https://play.google.com/store/apps/details?id=app.oo.android.kiare',
                                url: 'https://play.google.com/store/apps/details?id=app.oo.android.kiare',
                                title: 'Kiare app'
                              }, {
                                // Android only:
                                dialogTitle: 'Compartir . . .',
                                // iOS only:
                                excludedActivityTypes: [
                                  'com.apple.UIKit.activity.PostToTwitter'
                                ]
                              })
                }}
              >
                <IconFontAwesome
                  name="share-square"
                  size={40}
                  color="#88A451"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.horizontalBarLarge}>
              <Text style={[styles.textTitle, {marginBottom: 10}]}>{this.props.navigation.state.params.data.nombre}</Text>
              <View style={[styles.verticalAligning,{paddingLeft: 10, alignItems: 'center', marginBottom: 10}]}>
                <Icon
                  name="location-pin"
                  size={30}
                  color="#F8C029"
                />
                <Text numberOfLines={2} style={styles.textTitleMiddle}>{this.props.navigation.state.params.data.direccion}</Text>
              </View>

              <View style={[styles.verticalAligning,{paddingLeft: 10, alignItems: 'center', marginBottom: 10}]}>
                <Icon
                  name="clock"
                  size={25}
                  color="#EC573B"
                />

                {
                  (this.props.navigation.state.params.categoryName === 'EVENTOS' ||
                  (this.props.navigation.state.params.categoryName === 'CULTURA' &&
                   this.props.navigation.state.params.subcategoryName === 'EVENTOS CULTURALES') ||
                  (this.props.navigation.state.params.categoryName === 'DEPORTES' &&
                   (this.props.navigation.state.params.subcategoryName === 'CARRERAS ATLÉTICAS' ||
                    this.props.navigation.state.params.subcategoryName === 'EVENTO DEPORTIVO')))
                  ?
                  (
                    <View style={{marginLeft:5}}>
                    {
                      (this.props.navigation.state.params.data.fechaEvento)
                      ?
                      (
                        <Text style={styles.horarioTextStyle}>
                        { Moment(this.props.navigation.state.params.data.fechaEvento).locale('es', localization).format('LLL')}
                        </Text>
                      )
                      :
                      (<Text style={styles.horarioTextStyle}>
                      </Text>)
                    }
                   </View>
                  )
                 :
                  (
                    <View style={{marginLeft:5}}>
                      <Text style={styles.horarioTextStyle}>
                        Domingo: {(this.props.navigation.state.params.data.horarios[0].abi === 0 && this.props.navigation.state.params.data.horarios[0].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[0].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[0].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Lunes: {(this.props.navigation.state.params.data.horarios[1].abi === 0 && this.props.navigation.state.params.data.horarios[1].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[1].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[1].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Martes: {(this.props.navigation.state.params.data.horarios[2].abi === 0 && this.props.navigation.state.params.data.horarios[2].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[2].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[2].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Miércoles: {(this.props.navigation.state.params.data.horarios[3].abi === 0 && this.props.navigation.state.params.data.horarios[3].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[3].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[3].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Jueves: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[4].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[4].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[4].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Viernes: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[5].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[5].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[5].cer)}
                      </Text>
                      <Text style={styles.horarioTextStyle}>
                        Sábado: {(this.props.navigation.state.params.data.horarios[6].abi === 0 && this.props.navigation.state.params.data.horarios[6].cer === 0) ? 'Cerrado' : this.formatHours(this.props.navigation.state.params.data.horarios[6].abi) +' - '+ this.formatHours(this.props.navigation.state.params.data.horarios[6].cer)}
                      </Text>
                    </View>
                  )
                }

              </View>

                <View style={[styles.verticalAligning,{alignItems: 'center', marginBottom: 10}]}>
                    <Text numberOfLines={1} style={styles.textTitleMiddle}>Rango de precio: </Text>
                    <Text numberOfLines={1} style={styles.textTitleMiddle}>{this.props.navigation.state.params.data.rangoDePrecios ? this.props.navigation.state.params.data.rangoDePrecios : 'No establecido'}</Text>
                </View>

                <View style={[styles.verticalAligning,{alignItems: 'center', marginBottom: 10}]}>
                  <Icon
                    name="link"
                    size={18}
                    color="white"
                  />
                  <Text numberOfLines={1} style={styles.textTitleMiddle}>{this.props.navigation.state.params.data.web ? this.props.navigation.state.params.data.web : ' Sitio web no proporcionado.'}</Text>
                </View>
            </View>

            <View style={[styles.horizontalBarMedium, {padding: 10}]}>
              <View style={[styles.verticalAligning]}>
                <IconFontAwesome
                  name="newspaper-o"
                  size={25}
                  color="white"
                  style={{marginRight: 10}}
                />
                {this.props.navigation.state.params.data.informacion ? (<Text numberOfLines={6} style={[styles.textTitleMiddle, {width: width - 100}]}>{this.props.navigation.state.params.data.informacion}</Text>)
                : (<Text numberOfLines={4} style={[styles.textTitleMiddle, {width: width - 100}]}>Para más información visita nuestro establecimiento.</Text>)}
              </View>
            </View>

            <View style={styles.horizontalBarNoPaddingLarge}>
              <Swiper
                removeClippedSubviews={false}
                autoplay={false}
                width= {width - 40}
                height= {(height/2) + 20}
                style={{backgroundColor: "transparent", borderRadius: 10}}
                >
                  {this.props.navigation.state.params.data.imagenExtra
                    ?
                      (this.props.navigation.state.params.data.imagenExtra.map((item, i) => <Slider
                      imagenUrl={item.imagenUrl}
                      key={i}
                      />
                      ))
                    :
                      (<Text> No hay imágenes para mostrar. </Text>)
                  }
              </Swiper>
            </View>

            <View style={styles.horizontalBar}>
              <TouchableOpacity
                onPress={()=>{
                  if (this.props.navigation.state.params.data.latitud && this.props.navigation.state.params.data.longitud){
                    Alert.alert('¡Oye!', 'Te enviaremos a una app externa de Mapas. ¿Estás de acuerdo?',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, {text: 'Si', onPress: () => {
                      var url = null;
                      let coordenates = this.props.navigation.state.params.data.latitud + ','+ this.props.navigation.state.params.data.longitud;
                      let dirflg = '&dirflg=d'
                      if (Platform.OS === 'android'){
                        // here goes the call to open the google maps
                        url = 'http://maps.google.com/maps?daddr='
                      } else {
                        // her goes the call to open Apple maps
                        url = 'http://maps.apple.com/?daddr=';
                      }
                      Linking.openURL(url+coordenates+dirflg);
                    }},],  { cancelable: false });
                  }else {
                    Alert.alert('¡Oye!', 'GPS no detectado',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},], { cancelable: false });
                  }
                }
              }
              >
                <View style={[styles.verticalAligning, {alignItems: 'center', paddingHorizontal: 10, justifyContent: "center", width: width - 50 }]}>
                  <Text style={[styles.horarioTextStyle, {fontWeight: 'bold', marginRight: 20}]}>
                    Llévame al lugar
                  </Text>
                  <MaterialCommunityIcons
                    name="google-maps"
                    size={30}
                    color="#EC573B"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.horizontalBarTransparent}>
              <View style={[styles.verticalAligning, {alignItems: 'center', paddingHorizontal: 20, justifyContent: "space-between", width: width - 40 }]}>
                {this.props.navigation.state.params.data.facebook ? (
                  <TouchableOpacity
                    onPress={()=>{
                      if (this.props.navigation.state.params.data.facebook){
                          console.log('send to facebook');
                          this.props.navigation.navigate('WebBrowser', {url: this.props.navigation.state.params.data.facebook});
                      }else {
                        Alert.alert('Oops!', 'Fecebook no disponible',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},], { cancelable: false });
                      }
                    }}
                  >
                    <Icon
                      name="facebook-with-circle"
                      size={40}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : null}


                {this.props.navigation.state.params.data.twitter ? (
                  <TouchableOpacity
                    onPress={()=>{
                      if (this.props.navigation.state.params.data.twitter){
                          console.log('send to twitter');
                          this.props.navigation.navigate('WebBrowser', {url: this.props.navigation.state.params.data.twitter});
                      }else {
                        Alert.alert('Oops!', 'Twitter no disponible',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},], { cancelable: false });
                      }
                    }}
                  >
                    <Icon
                      name="twitter-with-circle"
                      size={40}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : null}


                {this.props.navigation.state.params.data.instagram ? (
                  <TouchableOpacity
                    onPress={()=>{
                      if (this.props.navigation.state.params.data.instagram){
                          console.log('send to instragram');
                          this.props.navigation.navigate('WebBrowser', {url: this.props.navigation.state.params.data.instagram});
                      }else {
                        Alert.alert('Oops!', 'Instagram no disponible',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},], { cancelable: false });
                      }
                    }}
                  >
                    <Icon
                      name="instagram-with-circle"
                      size={40}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : null}

                {this.props.navigation.state.params.data.google ? (
                  <TouchableOpacity
                    onPress={()=>{
                      if (this.props.navigation.state.params.data.google){
                          console.log('send to google plus');
                          this.props.navigation.navigate('WebBrowser', {url: this.props.navigation.state.params.data.google});
                      }else {
                        Alert.alert('Oops!', 'Google Plus no disponible',  [ {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},], { cancelable: false });
                      }
                    }}
                  >
                    <Icon
                      name="google--with-circle"
                      size={40}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : null}

              </View>
            </View>
            </View>
            </View>
         </ScrollView>
         <View style={styles.tabContainer}>
           <TouchableOpacity
             onPress={()=>{
               console.log("Likes");
               if (this.state.userUid){
                  console.log('Neg Detalle:'+this.props.navigation.state.params.estadoSeleccionado);
                  this.props.navigation.navigate('BusinessBySubcategory', {fromFavorites: true, estadoSeleccionado: this.props.navigation.state.params.estadoSeleccionado, latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude});
               } else {
                  Alert.alert('Favoritos', 'Necesitas estar loggeado para ver tus negocios favoritos.');
               }
             }}
           >
             <Ionicons name="md-heart" size={40} color="#ffffff" />
           </TouchableOpacity>

           <TouchableOpacity
             onPress={()=>{

             }}
           >
             <Ionicons name="md-home" size={40} color="#CE267A" />
           </TouchableOpacity>

           <TouchableOpacity
             onPress={()=>{
               AsyncStorage.getItem('user')
               .then((result)=>{
                 if (result){
                   var user = JSON.parse(result);
                   this.props.navigation.navigate('KiareLogOut');
                 } else {
                   this.props.navigation.navigate('KiareLogIn');
                 }
               })
               .catch((error)=>{
                 console.log(error);
               });
             }}
           >
             <Ionicons name="md-person" size={40} color="#ffffff" />
           </TouchableOpacity>
         </View>
         </View>
      </View>
    );
  }
}

const Slider = props => (
    <TouchableOpacity
    onPress={()=>{
      console.log('open');
    }}
    style={styles.touchableOpacitySliderStyle}
    >
      <View style={styles.sliderViewContainer}>
        <CachedImage resizeMode={'cover'} style={styles.imageSliderStyle} source={{uri: props.imagenUrl}}/>
      </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  containerAbsolute: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  sliderStyle: {
    backgroundColor:"transparent",
    height: 145,
    width,
    marginBottom: 20,
  },
  imageStyle:{
    flex: 1,
    width: 60,
    height: 60,
  },
  imageBusinessStyle:{
    flex: 1,
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  touchableOpacitySliderStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:"transparent",
  },
  imageSliderStyle: {
    flex: 1,
    width: width - 40,
    height: (height/2) + 20,
  },
  sliderViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horarioTextStyle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 16,
    fontWeight: '100',
  },
  nombreNegocioStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 24,
    fontWeight: '100',
    marginBottom: 20,
    alignItems: 'center',
  },
  masInformacionStyle: {
    backgroundColor: 'transparent',
    color: 'rgba(207, 187, 164, 1.0)',
    fontSize: 16,
    fontWeight: '100',
    marginBottom: 10,
  },
  logoImageStyle:{
    marginVertical: 10,
    width: ((width/3) * 1.8),
    height: ((width/3) * 1.8),
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImageSizeStyle:{
    width: ((width/3) * 1.2),
    height: ((width/3) * 1.2),
    borderRadius: 12,
  },
  buttonsBusinessContainer:{
    paddingTop: 10,
    width: ((width/3) * 1) - 30,
    height: ((width/3) * 1.8),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  buttonBusinessStyle:{
    width: 80,
    height: 65,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalAligning: {
    flexDirection: 'row',
  },
  horizontalBar:{
    width: width - 40,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalBarTransparent:{
    width: width - 40,
    height: 60,
    borderRadius: 8,
    backgroundColor: "transparent",
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalBarLarge:{
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: width - 40,
    height: (height/2) + 20,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal:10,
  },
  horizontalBarNoPaddingLarge:{
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: width - 40,
    height: (height/2) + 20,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  horizontalBarMedium:{
    width: width - 40,
    height: (height/5) * 1,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  smallText:{
    color:"white",
    fontSize: 14,
  },
  textTitle:{
    flexWrap: 'wrap',
    color: "white",
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  textTitleMiddle:{
    flexWrap: 'wrap',
    color: "white",
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  dialogContentView:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  containerRelative: {
    position: 'absolute',
    width,
    bottom: 20,
  },
  actionButtonIcon: {
  fontSize: 20,
  height: 22,
  color: 'white',
},
headerContainer: {
  width,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#272338'
},
headerImageContainer: {
  height: 30,
  marginTop: 20,
},
tabContainer:{
  width: width,
  height: 50,
  backgroundColor: "#272338",
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 30,
}
});

export default NegociosDetalle;
