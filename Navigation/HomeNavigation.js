import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Platform} from 'react-native';
import Infos from '../Screens/Infos';
import Maps from '../Screens/Maps';
import News from '../Screens/News';
import Register from '../Screens/Register';

let Home = createMaterialTopTabNavigator();

let HomeNavigation = () => {
  return (
    <Home.Navigator
      initialRouteName="Register"
      showPageIndicator={false}
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        tabBarIndicatorStyle: {backgroundColor: 'black'},
        tabBarStyle: {
          height: '10%',
          display: 'flex',
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          top: Platform.OS === 'android' ? 0 : '3%',
        },
        swipeEnabled: false,
      }}>
      <Home.Screen
        name="News"
        component={News}
        options={{
          title: 'Actus',
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      />
      <Home.Screen
        name="Infos"
        component={Infos}
        options={{
          title: 'Infos',
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      />
      <Home.Screen
        name="Maps"
        component={Maps}
        options={{
          title: 'Map',
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      />
      <Home.Screen
        name="Register"
        component={Register}
        options={{
          title: 'Inscription',
          tabBarLabelStyle: {
            fontSize: 10,
          },
        }}
      />
    </Home.Navigator>
  );
};

export default HomeNavigation;
