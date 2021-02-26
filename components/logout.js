import React, { Component } from 'react';
import { Button, ToastAndroid } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: ''
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    logout = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        await AsyncStorage.removeItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
            method: 'post',
            headers: {
                'X-Authorization': token
            } 
        })
        .then((response) => {
            if(response.status === 200){
                ToastAndroid.show("Signed Out", ToastAndroid.SHORT);
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                ToastAndroid.show("Please log in first", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server';
            }
        }) 
    }
    

    checkLoggedIn = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        if (token == null) {
            this.props.navigation.navigate('Login');
        }
    };

    render() {
        return(
            <Button
                title = "Logout"
                onPress = {() => this.logout()}
            />
        );
    }

}

export default Logout;