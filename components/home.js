import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, TouchableOpacity, Button, ToastAndroid, FlatList, Alert} from 'react-native';
import {Container, Header, Body, Title, Card, CardItem, Left, Right, Icon, Content, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Location from './location';

class Home extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            locationsData: null
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.checkLoggedIn();
            
        });
        this.getData();
    }

    getToken = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return token;
      }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("Login");
        }
    };

    getData = async () => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 400){
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised G", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                locationsData: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
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
            return(
                <Container style={styles.container}>
                    <Content>
                        <Card>
                            <CardItem>
                                <Icon name="location"/>
                                <Title style={styles.text}>Locations</Title>
                            </CardItem>
                        </Card>
                        
                        <FlatList
                            data={this.state.locationsData}
                            renderItem={({item}) => (
                                <Location
                                    onPress={() => navigation.navigate("LocationInfo", {
                                        "Key": item.location_id.toString()
                                    })}
                                    location_name = {item.location_name}
                                    location_town =  {item.location_town}
                                    avg_overall_rating = {item.avg_overall_rating}
                                    //photo_path={{uri:"http://cdn.coffida.com/images/78346822.jpg"}}
                                    //photo_path={{uri:item.photo_path}}
                                    photo_path={{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                                /> 
                            )}
                            keyExtractor={(item) => item.location_id.toString()}
                        />

                    </Content>
                </Container>
            );
        }
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    text: {
        color: 'black',
        fontWeight: 'bold'
    }
});