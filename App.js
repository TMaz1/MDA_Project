import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


//user adds login credentials given from signing up to use mobile app
import Login from './components/login';
//user needs login credentials to use mobile app by signing up to app
import Signup from './components/signup';

//direct user to a list of possible coffee venues to review
import Home from './components/home';
//information about specific location
import LocationInfo from './components/locationinfo';

//search locations
import SearchLocations from './components/searchlocations';

//user information 
import Profile from './components/profile';
//information about specific review
import ReviewInfo from './components/reviewinfo';
import EditProfile from './components/editprofile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={Home}/>
    <HomeStack.Screen name="LocationInfo" component={LocationInfo}/>
  </HomeStack.Navigator>
); 

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile}/>
    <ProfileStack.Screen name="EditProfile" component={EditProfile}/>
  </ProfileStack.Navigator>
); 

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStackScreen}/>
    <Tab.Screen name="SearchLocations" component={SearchLocations} options={{title: "Search"}}/>
    <Tab.Screen name="Profile" component={ProfileStackScreen}/>
  </Tab.Navigator>
);



class Entry extends Component{
  render(){
    return(
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={Tabs}/>
          <Drawer.Screen name="Profile" component={ProfileStackScreen}/>
        </Drawer.Navigator>
        
        
        {/* <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{title:"Sign In"}}/>
          <Stack.Screen name="Signup" component={Signup} options={{title:"Register"}} />
        </Stack.Navigator> */}
      </NavigationContainer>
    );
  }
}


export default Entry;