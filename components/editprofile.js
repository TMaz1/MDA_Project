import React, {Component} from 'react';
import {ActivityIndicator , View, Text, Button, Alert, TextInput, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditProfile extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: null,

            updated_first_name: '',
            updated_last_name: '',
            updated_email: '',
            updated_password: ''
        };
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.checkLoggedIn();
            this.getUserData();
        })
        this.checkLoggedIn();
        this.getUserData();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("Login");
        }
    };

    getUserData = async () => {
        //const userID = await AsyncStorage.getItem('@user_id');
        const userID = 14;
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
            headers: {
                'X-Authorization': "5dc270748cdabc55eb642b9fb0189cb8"
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 400){
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                userData: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    updateUserInfo = async () => {
        let to_send = {};
    
        if (this.state.updated_first_name != this.state.userData.first_name){
          to_send['first_name'] = this.state.updated_first_name;
        }
    
        if (this.state.updated_last_name != this.state.userData.last_name){
          to_send['last_name'] = this.state.updated_last_name;
        }
    
        if (this.state.updated_email != this.state.userData.email){
          to_send['email'] = this.state.updated_email;
        }
    
        if (this.state.updated_password != this.state.userData.password){
          to_send['password'] = this.state.updated_password;
        }
    
        console.log(to_send);
    
        //const userID = await AsyncStorage.getItem('@user_id');
        const userID = 14;
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
          method: 'patch',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': "5dc270748cdabc55eb642b9fb0189cb8"
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 400){
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 403){
                ToastAndroid.show("Updating Information That Is Not Yours...", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 404){
                ToastAndroid.show("Not Found", ToastAndroid.SHORT)
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            //idk if this is the right move
            console.log(responseJson);
            ToastAndroid.show("Account Information Updated", ToastAndroid.SHORT);
            this.props.navigation.navigate("DisplayProfile");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    displayAlert = () => {
        Alert.alert(
            '',
            'Are you sure you want to make these changes?',  
            [
               {text: 'Cancel', onPress: () => this.props.navigation.navigate("displayProfile")},
               {text: 'OK', onPress: () => this.updateUserInfo()},
            ],
            { cancelable: false }
       )
    }


    render(){
        const navigation = this.props.navigation;
        if(this.state.isLoading){
            return (
                <View style={styles.container}>
                    <ActivityIndicator style={styles.loading}/>
                </View>
            )
        }else{
            return (
                <View>
                  <Text>Update User Information</Text>
      
                  <Text>First Name:</Text>
                  <TextInput
                    placeholder={this.state.userData.first_name}
                    onChangeText={(updated_first_name) => this.setState({updated_first_name})}
                    value={this.state.updated_first_name}
                  />
                  <Text>Last Name:</Text>
                  <TextInput
                    placeholder={this.state.userData.last_name}
                    onChangeText={(updated_last_name) => this.setState({updated_last_name})}
                    value={this.state.updated_last_name}
                  />
                  <Text>Email:</Text>
                  <TextInput
                    placeholder={this.state.userData.email}
                    onChangeText={(updated_email) => this.setState({updated_email})}
                    value={this.state.updated_email}
                  />
                  <Text>Password:</Text>
                  <TextInput
                    placeholder={this.state.userData.password}
                    onChangeText={(updated_password) => this.setState({updated_password})}
                    value={this.state.updated_password}
                  />
                  <Button
                    title="Update"
                    onPress={() => this.displayAlert()}
                  />
                </View>
            );
        }
    }
}

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    loading: {
        color: '#ab7343'
    },
    text: {
        padding: 5, 
        borderWidth: 1, 
        margin: 5
    }
});