import 'react-native-gesture-handler';

import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';


//user adds login credentials given from signing up to use mobile app
import Login from './components/login';
//user needs login credentials to use mobile app by signing up to app
import Signup from './components/signup';
import Logout from './components/logout';

//direct user to a list of possible coffee venues to review
import Home from './components/home';
//information about specific location
import LocationInfo from './components/locationinfo';
//allow user to add review to specific location
import AddReview from './components/addreview';
import AddPhoto from './components/addphoto';

//search locations
import SearchLocations from './components/searchlocations';
import SearchResults from './components/searchresults';

//user information 
import Profile from './components/profile';
//information about specific review
import EditReview from './components/editreview';
import EditProfile from './components/editprofile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#e0cbaf'
    }
    }}>
    
    <HomeStack.Screen name="Home" component={Home} options={{
      headerLeft: () => <Icon.Button 
        name="bars" 
        size={25} 
        backgroundColor={'#e0cbaf'} 
        color={'black'} 
        onPress={() => navigation.openDrawer()}>
        </Icon.Button>
      }}/>
    <HomeStack.Screen name="LocationInfo" component={LocationInfo} options={{title: "Location"}}/>
    <HomeStack.Screen name="AddReview" component={AddReview} options={{title: "Review"}}/>
    <HomeStack.Screen name="AddPhoto" component={AddPhoto} options={{title: "Photo"}}/>
  </HomeStack.Navigator>
); 

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#e0cbaf'
    }
    }}>
    <ProfileStack.Screen name="Profile" component={Profile} options={{
      headerLeft: () => <Icon.Button 
        name="bars" 
        size={25} 
        backgroundColor={'#e0cbaf'} 
        color={'black'} 
        onPress={() => navigation.openDrawer()}>
        </Icon.Button>
      }}/>
    <ProfileStack.Screen name="EditProfile" component={EditProfile}/>
    <ProfileStack.Screen name="EditReview" component={EditReview}/>
  </ProfileStack.Navigator>
); 

const SearchStackScreen = ({navigation}) => (
  <SearchStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#e0cbaf'
    }
    }}>
    <SearchStack.Screen name="SearchLocations" component={SearchLocations} options={{
      title: "Search Locations",
      headerLeft: () => <Icon.Button 
        name="bars" 
        size={25} 
        backgroundColor={'#e0cbaf'} 
        color={'black'} 
        onPress={() => navigation.openDrawer()}>
        </Icon.Button>
      }}/>
    <SearchStack.Screen name="SearchResults" component={SearchResults}/>
  </SearchStack.Navigator>
); 

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStackScreen} options={{
      title: "Home", 
      tabBarIcon: ({color}) => <Icon name = {'home'} size = {20} color = {color}/>}}/>
    <Tab.Screen name="SearchLocations" component={SearchStackScreen} options={{
      title: "Search", 
      tabBarIcon: ({color}) => <Icon name = {'search1'} size = {20} color = {color}/>}}/>
    <Tab.Screen name="Profile" component={ProfileStackScreen} options={{
      title: "Profile", 
      tabBarIcon: ({color}) => <Icon name = {'profile'} size = {20} color = {color}/>}}/>
  </Tab.Navigator>
);

const EnterStackScreen = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{title:"Sign In"}}/>
    <Stack.Screen name="Signup" component={Signup} options={{title:"Register"}} />
  </Stack.Navigator>
)

class Entry extends Component{
  render(){
    return(
      <NavigationContainer>
          <Drawer.Navigator>
            {/* <Drawer.Screen name="Login" component={EnterStackScreen}/> */}
            <Drawer.Screen name="Home" component={Tabs}/>
            <Drawer.Screen name="Search" component={SearchStackScreen} />
            <Drawer.Screen name="Profile" component={ProfileStackScreen}/>
            <Drawer.Screen name="Logout" component={Logout}/>
          </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}


export default Entry;