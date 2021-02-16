import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Container} from 'native-base';

class Login extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <Container style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Welcome!</Text>
                </View>
                <View style={styles.loginContainer}>
                    <Text style={styles.bodyText}>Email</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCaptialize="none"
                        />
                    </View>

                    <Text style={[styles.bodyText, {marginTop: 30}]}>Password</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Your Password"
                            style={styles.textInput}
                            secureTextEntry={true}
                            autoCaptialize="none"
                        />
                    </View>
                </View>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Locations')}
                        style={styles.button}
                    >
                    <Text style={styles.buttonText}>Sign In</Text> 
                    </TouchableOpacity>


                    <Text style={[styles.bodyText, {paddingTop: 40}]}>Not Signed In?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={[styles.button, {marginTop: 5}]}
                    >
                    <Text style={styles.buttonText}>Register</Text> 
                    </TouchableOpacity>
                </View>

            </Container>
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
        backgroundColor: '#66462f'
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
        backgroundColor: '#66462f',
        textAlign: 'center'
    },
    buttonText: {
        color: '#f5edda',    
        fontWeight: 'bold',
        fontSize: 18
    }
});

