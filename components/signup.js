import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, ToastAndroid} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

class Signup extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = async () => {
        //VALIDATION HERE

        return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if (response.status === 201){
                return response.json()
            }else if (response.status === 400){
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server';
            }
        })
        .then(async (responseJson) => {
            console.log("User created with ID: ", responseJson);
            ToastAndroid.show("Account Created", ToastAndroid.SHORT);
            this.props.navigation.navigate("Login");
        })
        .catch((error) =>  {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        const navigation = this.props.navigation;

        return(
            <ScrollView>
                <View style={styles.container}>
                    <TextInput style={styles.text}
                        placeholder = "Enter Your First Name"
                        onChangeText = {(first_name) => this.setState({first_name})}
                        value = {this.state.first_name}
                    />
                    <TextInput style={styles.text}
                        placeholder = "Enter Your Last Name"
                        onChangeText = {(last_name) => this.setState({last_name})}
                        value = {this.state.last_name}
                    />
                    <TextInput style={styles.text}
                        placeholder = "Enter Your Email"
                        onChangeText = {(email) => this.setState({email})}
                        value = {this.state.email}
                    />
                    <TextInput style={styles.text}
                        placeholder = "Enter Your Password"
                        //placeholder = "•••••••••••••••"
                        onChangeText = {(password) => this.setState({password})}
                        value = {this.state.password}
                        secureTextEntry
                    />
                    <Button
                        title = "Create Account"
                        onPress = {() => this.signup()}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    text: {
        padding: 5, 
        borderWidth: 1, 
        margin: 5
    }
});