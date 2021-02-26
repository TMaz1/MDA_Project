import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ToastAndroid} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {Container} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {
        //VALIDATION HERE
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if (response.status === 200){
                return response.json()
            }else if (response.status === 400){
                ToastAndroid.show("Invalid email password", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server';
            }
        })
        .then(async (responseJson) => {
            //console.log(responseJson);
            await AsyncStorage.setItem('@session_token', responseJson.token);
            await AsyncStorage.setItem('@user_id', responseJson.id.toString());
            this.props.navigation.navigate("Home", {screen: "Home"});
        })
        .catch((error) =>  {
            //console.log(error);
            //ToastAndroid.show(error, ToastAndroid.SHORT);
        }) 
    }

    render(){
        const navigation = this.props.navigation;
        return(
            <ScrollView>
                <Container style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Welcome!</Text>
                    </View>
                    <View style={styles.loginContainer}>
                        <Text style={styles.bodyText}>Email</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Your Email"
                                onChangeText = {(email) => this.setState({email})}
                                value = {this.state.email}
                                style={styles.textInput}
                                autoCaptialize="none"
                            />
                        </View>

                        <Text style={[styles.bodyText, {marginTop: 30}]}>Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Your Password"
                                onChangeText = {(password) => this.setState({password})}
                                value = {this.state.password}
                                style={styles.textInput}
                                secureTextEntry={true}
                                autoCaptialize="none"
                            />
                        </View>
                    </View>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress = {() => this.login()}
                            style={styles.button}
                        >
                        <Text style={styles.buttonText}>Sign In</Text> 
                        </TouchableOpacity>

                        <Text style={[styles.bodyText, {paddingTop: 40}]}>Not Signed In?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Signup")}
                            style={[styles.button, {marginTop: 5}]}
                        >
                        <Text style={styles.buttonText}>Register</Text> 
                        </TouchableOpacity>
                    </View>
                </Container>
            </ScrollView>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5edda'
    },
    headerContainer:{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#2e1503'
    },
    loginContainer:{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#f5edda',
        padding: 20
    },
    headerText:{
        color: '#f5edda',  
        padding: 10,  
        fontWeight: 'bold',
        fontSize: 32
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 20
    },
    bodyText: {
        color: '#66462f',
        fontSize: 16
    },
    textInput: {
        color: '#261a12',
        fontSize: 16
    },
    buttonContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5edda'
    },
    button: {
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#2e1503',
        textAlign: 'center'
    },
    buttonText: {
        color: '#f5edda',    
        fontWeight: 'bold',
        fontSize: 18
    }
});

