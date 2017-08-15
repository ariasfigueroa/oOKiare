import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  WebView,
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';

class WebBrowser extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (<TouchableOpacity
      onPress={()=>{
                    const backAction = NavigationActions.back();
                    navigation.dispatch(backAction);
                  }
              }>
              <View style={{paddingLeft: 20}}>
                <Icon
                  name= "back"
                  color= "#CFBBA4"
                  size={20}
                />
              </View>
            </TouchableOpacity>)
  }
);

constructor(props) {
  super(props);
  console.log(this.props.navigation.state.params.url);
}

  render(){
    return (
      <WebView
        source={{uri: this.props.navigation.state.params.url}}
      />
    );
  }
}

export default WebBrowser;
