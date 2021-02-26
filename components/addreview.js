import React, {Component} from 'react';
import {ActivityIndicator, View, Text, StyleSheet, Button, ToastAndroid} from 'react-native';
import {Container, Input, Title, Card, CardItem, Left, Right} from 'native-base';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class AddReview extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            userData: [],

            locationKey: '',
            locationNameKey: '',

            review_id: '',
            overall_rating: '',
            price_rating: '',
            quality_rating: '',
            clenliness_rating: '',
            review_body: ''
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log("Params", this.props.route.params);
            if(this.props.route.params){
                const {locationKey} = this.props.route.params
                this.setState({
                    locationKey: this.props.route.params.locationKey,
                    locationNameKey: this.props.route.params.locationNameKey
                })
            }
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

    addReview = async () => {
        let to_send = {};
        to_send['overall_rating'] = parseInt(this.state.overall_rating);
        to_send['price_rating'] = parseInt(this.state.price_rating);
        to_send['quality_rating'] = parseInt(this.state.quality_rating);
        to_send['clenliness_rating'] = parseInt(this.state.clenliness_rating);
        to_send['review_body'] = this.state.review_body;

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            if (response.status === 201){
                ToastAndroid.show("Review Added!", ToastAndroid.SHORT);
            }else if (response.status === 400){
                ToastAndroid.show("Invalid location ID", ToastAndroid.SHORT);
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT);
            }else if (response.status === 404){
                ToastAndroid.show("Not Found - Location ID does not exist", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            //ToastAndroid.show("Review Added!", ToastAndroid.SHORT);
        })
        .catch((error) =>  {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        }) 
    }
    
    getUserData = async () => {
        const userID = await AsyncStorage.getItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
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

    onChangeTextInput = (text) => {
        const numericRegex = new RegExp(/^[0-9]{0,5}$/);
        if(numericRegex.test(text)) {
            this.setState({ quality_rating: text })
        }
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
                <ScrollView>
                    <Container style={styles.container}>
                        <Title style={styles.title}>{this.state.locationKey}</Title>
                        <Text>user first name: {this.state.userData.first_name}</Text>
                        
                        <Card>
                            <CardItem>
                                <Left>
                                    <Text>Enter Overall Rating:</Text>
                                </Left>
                                <Right>
                                    <TextInput style={styles.textInput}
                                        placeholder = "0.0"
                                        keyboardType={'numeric'}
                                        onChangeText = {(overall_rating) => this.setState({overall_rating})}
                                        value = {this.state.overall_rating}
                                    />
                                </Right>
                            </CardItem>
                        </Card>

                        <Card>
                            <CardItem>
                                <Left>
                                    <Text>Enter Price Rating:</Text>
                                </Left>
                                <Right>
                                    <TextInput style={styles.textInput}
                                        placeholder = "0.0"
                                        keyboardType={'numeric'}
                                        onChangeText = {(price_rating) => this.setState({price_rating})}
                                        value = {this.state.price_rating}
                                    />
                                </Right>
                            </CardItem>
                        </Card>
                        
                        <Card>
                            <CardItem>
                                <Left>
                                    <Text>Enter Quality Rating:</Text>
                                </Left>
                                <Right>
                                    <TextInput style={styles.textInput}
                                        placeholder = "0.0"
                                        keyboardType={'numeric'}
                                        //onChangeText={this.onChangeTextInput}
                                        onChangeText = {(quality_rating) => this.setState({quality_rating})}
                                        value = {this.state.quality_rating}
                                    />
                                </Right>
                            </CardItem>
                        </Card>

                        <Card>
                            <CardItem>
                                <Left>
                                    <Text>Enter Cleanliness Rating:</Text>
                                </Left>
                                <Right>
                                    <TextInput style={styles.textInput}
                                        placeholder = "0.0"
                                        keyboardType={'numeric'}
                                        onChangeText = {(clenliness_rating) => this.setState({clenliness_rating})}
                                        value = {this.state.clenliness_rating}
                                    />
                                </Right>
                            </CardItem>
                        </Card>

                        
                        <Card>
                            <CardItem>
                                <Left>
                                <Text>Enter Review:</Text>
                                </Left>
                                <Right>
                                <TextInput style={styles.bodyInput}
                                    placeholder="Type Here..."
                                    multiline={true}
                                    maxLength={200}
                                    onChangeText = {(review_body) => this.setState({review_body})}
                                    value = {this.state.review_body}
                                />
                                </Right>
                            </CardItem>
                        </Card>

                        <Button
                            title="Save"
                            onPress = {() => this.addReview()}
                        />
                        <Button
                            title="Add a Photo"
                            onPress = {() => this.props.navigation.navigate("AddPhoto", {
                                "reviewKey": Math.max(...this.state.userData.reviews),
                                "locationKey": this.state.locationKey,
                            })}
                        />
                    </Container>
                </ScrollView>
            );
        }
    }
}

export default AddReview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#f5edda',
        padding: 15
    },
    title: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 18,
        paddingBottom: 15,
        paddingLeft: 15
    },
    textInput: {
        flexDirection: 'row',
        width: 100,
        padding: 5, 
        borderWidth: 1, 
        margin: 5,
        paddingBottom: 5
    },
    bodyInput: {
        padding: 5, 
        borderWidth: 1, 
        margin: 5,
        paddingLeft: 5,
        width: 200,
        height: 70
    }
});