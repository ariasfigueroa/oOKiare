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
} from 'react-native';

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
      }

      this.showScaleAnimationDialog = this.showScaleAnimationDialog.bind(this);
      this.scaleAnimationServiceDialog = this.scaleAnimationServiceDialog.bind(this);
      this.scaleAnimationSugerenciaDialog = this.scaleAnimationSugerenciaDialog.bind(this);

      console.log(this.props.navigation.state.params);
    }

    showScaleAnimationDialog() {
      this.scaleAnimationDialog.show();
    }

    scaleAnimationServiceDialog(){
      this.scaleAnimationServiceDialog.show();
    }

    scaleAnimationSugerenciaDialog(){
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
              <Text>{this.props.navigation.state.params.data.promo ? this.props.navigation.state.params.data.promo : 'No hay promo...'}</Text>
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
                <TouchableOpacity
                  onPress={this.showScaleAnimationDialog}
                >
                  <View style={styles.buttonBusinessStyle}>
                    <MaterialCommunityIcons
                      name= "sale"
                      size={40}
                      color="#EC573B"
                    />
                    <Text style={styles.smallText}>Promos</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.scaleAnimationServiceDialog}
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
                <TouchableOpacity
                  onPress={this.scaleAnimationSugerenciaDialog}
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
              >
                <MaterialCommunityIcons
                  name="heart"
                  size={40}
                  color="#F8C029"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginHorizontal: 20}}
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
                <View style={{marginLeft:5}}>
                <Text style={styles.horarioTextStyle}>
                  Domingo: {(this.props.navigation.state.params.data.horarios[0].abi === 0 && this.props.navigation.state.params.data.horarios[0].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[0].abi +' - '+ this.props.navigation.state.params.data.horarios[0].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Lunes: {(this.props.navigation.state.params.data.horarios[1].abi === 0 && this.props.navigation.state.params.data.horarios[1].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[1].abi +' - '+ this.props.navigation.state.params.data.horarios[1].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Martes: {(this.props.navigation.state.params.data.horarios[2].abi === 0 && this.props.navigation.state.params.data.horarios[2].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[2].abi +' - '+ this.props.navigation.state.params.data.horarios[2].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Miércoles: {(this.props.navigation.state.params.data.horarios[3].abi === 0 && this.props.navigation.state.params.data.horarios[3].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[3].abi +' - '+ this.props.navigation.state.params.data.horarios[3].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Jueves: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[4].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[4].abi +' - '+ this.props.navigation.state.params.data.horarios[4].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Viernes: {(this.props.navigation.state.params.data.horarios[5].abi === 0 && this.props.navigation.state.params.data.horarios[5].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[5].abi +' - '+ this.props.navigation.state.params.data.horarios[5].cer}
                </Text>
                <Text style={styles.horarioTextStyle}>
                  Sábado: {(this.props.navigation.state.params.data.horarios[6].abi === 0 && this.props.navigation.state.params.data.horarios[6].cer === 0) ? 'Cerrado' : this.props.navigation.state.params.data.horarios[6].abi +' - '+ this.props.navigation.state.params.data.horarios[6].cer}
                </Text>
                </View>
              </View>

              <View style={[styles.verticalAligning,{alignItems: 'center', marginBottom: 10}]}>
                <Text numberOfLines={1} style={styles.textTitleMiddle}>Rango de precio: </Text>
                <Text numberOfLines={1} style={styles.textTitleMiddle}>{this.props.navigation.state.params.data.rangoDePrecions ? this.props.navigation.state.params.data.rangoDePrecions : 'No establecido'}</Text>
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
                {this.props.navigation.state.params.data.informacion ? (<Text numberOfLines={4} style={[styles.textTitleMiddle, {width: width - 100}]}>{this.props.navigation.state.params.data.informacion}</Text>)
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
                  {this.props.navigation.state.params.data.imagenExtra.map((item, i) => <Slider
                    imagenUrl={item.imagenUrl}
                    key={i}
                    />
                  )
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
                        url = 'geo:';
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
                    Llevame al Lugar
                  </Text>
                  <MaterialCommunityIcons
                    name="google-maps"
                    size={30}
                    color="#EC573B"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.horizontalBar}>
              <View style={[styles.verticalAligning, {alignItems: 'center', paddingHorizontal: 20, justifyContent: "space-between", width: width - 40 }]}>
                <TouchableOpacity
                  onPress={()=>{
                    if (this.props.navigation.state.params.data.facebookUrl){
                        console.log('send to facebook');
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
                <TouchableOpacity
                  onPress={()=>{
                    if (this.props.navigation.state.params.data.twitterkUrl){
                        console.log('send to twitter');
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
                <TouchableOpacity
                  onPress={()=>{
                    if (this.props.navigation.state.params.data.instagramkUrl){
                        console.log('send to instragram');
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
                <TouchableOpacity
                  onPress={()=>{
                    if (this.props.navigation.state.params.data.googlekUrl){
                        console.log('send to google plus');
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
              </View>
            </View>
            </View>
            </View>
         </ScrollView>
         <View style={styles.containerRelative}>
           <ActionButton
           position="right"
           buttonColor="rgba(213,85,60,1)">
             <ActionButton.Item buttonColor='#F8C029' title="Likes" onPress={() => console.log("notes tapped!")}>
               <Ionicons name="md-heart" style={styles.actionButtonIcon} />
             </ActionButton.Item>
             <ActionButton.Item buttonColor='#88A451' title="Home" onPress={() => {}}>
               <Ionicons name="md-home" style={styles.actionButtonIcon} />
             </ActionButton.Item>
             <ActionButton.Item buttonColor='#EC573B' title="Profile" onPress={() => {}}>
               <Ionicons name="md-person" style={styles.actionButtonIcon} />
             </ActionButton.Item>
           </ActionButton>
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
    bottom: 10,
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
    width: ((width/3) * 2),
    height: (height/2) - 60,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 10
  },
  logoImageSizeStyle:{
    width: ((width/3) * 2),
    height: (height/2) - 60,
  },
  buttonsBusinessContainer:{
    marginVertical: 10,
    marginLeft: 5,
    width: ((width/3) * 1) - 30,
    height: (height/2) - 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 20
  },
  buttonBusinessStyle:{
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
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
    height: (height/6) * 1,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },
  smallText:{
    color:"white",
    fontSize: 10,
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
}
});

export default NegociosDetalle;
