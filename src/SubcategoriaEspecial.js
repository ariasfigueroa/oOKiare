import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackNavigator, NavigationActions } from 'react-navigation';

class SubcategoriaEspecial extends Component{

  static navigationOptions = ({ navigation}) => ({
      headerTitle: navigation.state.params.estadoNombre,
      headerRight:
      (<View style={{marginRight: 20,}}>
        <TouchableOpacity
          onPress={
            ()=>{
              navigation.state.params.mostrarCambioEstadoManual();
              const backAction = NavigationActions.back();
              navigation.dispatch(backAction)
            }
          }
        >
          <IconFontAwesome
            name="exchange"
            size={20}
            color="rgba(207, 187, 164, 1.0)"
          />
        </TouchableOpacity>
      </View>),
      headerLeft: (<View/>),
      tabBarLabel: 'Alrededor',
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="place"
          size={20}
          color="#CFBBA4"
        />
      ),
    });

    constructor(props){
      super(props);
      this.state = {
        data: [],
      }
      //console.log(this.props.screenProps);
    }

    componentWillMount(){
      //console.log('set the data here');
      var values =  [];
      values.push({key: 1, text: '•••'});
      values.push({key: 2, text: '•••'});
      values.push({key: 3, text: '•••'});
      values.push({key: 4, text: '•••'});
      this.setState({data:values});
    }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
        />
        <Image source={require('../resources/images/fondo_nuevo.png')}/>
        <View style={styles.containerList}>
          <FlatList
            horizontal={false}
            numColumns={3}
            data={this.state.data}
            renderItem={({item}) =>
              <View style={{alignItems:"center", marginBottom: 10}}>
                <View style={{backgroundColor:"rgba(255,255,255,0.3)", width: 60, height: 60, marginLeft: 20, marginRight: 20, marginBottom: 10,  borderRadius: 12}}>
                  <TouchableOpacity
                    style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                    onPress={() => this.props.navigation.navigate('NegociosPorCategoria')}
                    >
                  </TouchableOpacity>
                </View>
                <Text style={{backgroundColor: 'transparent', color: "#CFBBA4", fontSize: 12, fontWeight: '100',}}> {item.text} </Text>
              </View>
            }
          />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  containerList: {
    flex: 1,
    position: "absolute",
    top: 20,
  }
});


export default SubcategoriaEspecial;
