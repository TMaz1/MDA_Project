import React, {Component} from 'react';
import {ActivityIndicator, View, Text, ToastAndroid, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {RNCamera} from 'react-native-camera';

class AddPhoto extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
            locationKey: '',
            reviewKey: ''
        }
    }
    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log("Params", this.props.route.params);
            if(this.props.route.params){
                this.setState({
                    reviewKey: this.props.route.params.reviewKey,
                    locationKey: this.props.route.params.locationKey
                })
            }
            this.checkLoggedIn();
        })
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("Login");
        }
    };


    addPhoto = async (picture) => {
        console.log(picture.uri)
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + this.state.reviewKey + "/photo", {
            method: 'post',
            headers: {
                'Content-Type': 'image/jpeg',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: picture
        })
        .then((response) => {
            if (response.status === 200){
                return response.json()
            }else if (response.status === 400){
                ToastAndroid.show("400 - Cannot Add Photo", ToastAndroid.SHORT);
            }else if (response.status === 401){
                ToastAndroid.show("401- Unauthorised", ToastAndroid.SHORT);
            }else if (response.status === 404){
                ToastAndroid.show("Not Found - Photo does not exist", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            ToastAndroid.show("Photo Added!", ToastAndroid.SHORT);
        })
        .catch((error) =>  {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
            throw error;
        }) 
    }

    takePicture = async () => {
        if(this.camera){
            const options = {quality: 0.5, base64: true};
            const picture = await this.camera.takePictureAsync(options);
            //this.displayAlert(picture);
            this.addPhoto(picture); 
        }
    }

    displayAlert = (picture) => {
       setTimeout(() => {
            Alert.alert(
                '',
                'Add this photo to review?',  
                [
                    {text: 'Cancel', onPress: () => this.takePicture()},
                    {text: 'OK', onPress: () => this.addPhoto(picture)},
                ],
                { cancelable: false }
            )
       }, 2000);
    }

    render(){
        const navigation = this.props.navigation;
        if(this.state.isLoading){
            return (
                <View style={styles.container}>
                    <ActivityIndicator style={styles.loading}/>
                    <Text>{this.state.reviewKey}</Text>
                </View>
            )
        }else{
            return(
                <View style={styles.container}>
                    <RNCamera style={styles.camera}
                        ref={ref => {
                            this.camera = ref;
                        }}
                    />
                    
                    <TouchableOpacity style={styles.button} onPress={() => this.takePicture()}>
                        <Icon
                            name = {'camera'}
                            size = {20}
                        />
                        <Text> Take Photo</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

export default AddPhoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 5
    }  
});