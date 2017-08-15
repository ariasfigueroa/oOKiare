import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import SubcategoriaComer from './SubcategoriaComer';
import SubcategoriaDiversion from './SubcategoriaDiversion';
import SubcategoriaEventos from './SubcategoriaEventos';
import SubcategoriaPistear from './SubcategoriaPistear';
import SubcategoriaEspecial from './SubcategoriaEspecial';
import NegociosPorCategoria from './NegociosPorCategoria';
import KiareApp from './KiareApp';
import Icon from 'react-native-vector-icons/FontAwesome';
import hoistNonReactStatic from 'hoist-non-react-statics';

const Tabs = TabNavigator({
  Comer: {
    screen: hoistNonReactStatic(({ screenProps }) => <SubcategoriaComer screenProps={{estadoSeleccionado: screenProps.estadoSeleccionado, data: screenProps.dataComer}}/>, SubcategoriaComer),
  },
  Diversion: {
    screen: hoistNonReactStatic(({ screenProps }) => <SubcategoriaDiversion screenProps={{estadoSeleccionado: screenProps.estadoSeleccionado, data: screenProps.dataDiversion}}/>, SubcategoriaDiversion),
  },
  Pistear: {
    screen: hoistNonReactStatic(({ screenProps }) => <SubcategoriaEventos screenProps={{estadoSeleccionado: screenProps.estadoSeleccionado, data: screenProps.dataPistear}}/>, SubcategoriaEventos),
  },
  Eventos: {
    screen: hoistNonReactStatic(({ screenProps }) => <SubcategoriaPistear screenProps={{estadoSeleccionado: screenProps.estadoSeleccionado, data: screenProps.dataEventos}}/>, SubcategoriaPistear),
  },
  Especial: {
    screen: hoistNonReactStatic(({ screenProps }) => <SubcategoriaEspecial screenProps={{estadoSeleccionado: screenProps.estadoSeleccionado, data: screenProps.dataEspecial}}/>, SubcategoriaEspecial),
  }
},
{
  tabBarComponent: TabBarBottom,
  tabBarPosition: "bottom",
  tabBarOptions: {
    style: {
      backgroundColor: 'rgba(70, 34, 72, 1.0)'
    },
    labelStyle: {
      fontSize: 12,
      marginBottom: 6,
  },
    activeTintColor: 'rgba(207, 187, 164, 1.0)',
    activeBackgroundColor: '#272238',
  }
}
);

export const Stack = StackNavigator({
  Principal: {
    screen: ({ screenProps }) => <KiareApp screenProps={screenProps}/>,
  },
  Menu: {
    screen: ({ screenProps }) => <Tabs screenProps={screenProps}/>,
  },
  NegociosPorCategoria: {
    screen: ({ screenProps }) => <NegociosPorCategoria screenProps={screenProps}/>
  }
},
{
  navigationOptions: {
    headerTitle: 'Ciudad',
    headerTitleStyle: {
      backgroundColor: 'transparent',
      color: 'rgba(207, 187, 164, 1.0)',
      fontSize: 24,
      fontWeight: '100',
    },
    headerRight:
    (<View style={{marginRight: 20,}}>
      <TouchableOpacity>
        <Icon
          name="exchange"
          size={20}
          color="rgba(207, 187, 164, 1.0)"
        />
      </TouchableOpacity>

    </View>),
    headerStyle: {
      backgroundColor: "#272238",
    }
  }
}
);
