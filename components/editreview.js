import React, {Component} from 'react';
import {ActivityIndicator , View, Text, Button, Alert, TextInput, StyleSheet, ToastAndroid, TouchableOpacity, FlatList} from 'react-native';
import {Container, Input, Title, Card, CardItem, Left, Right} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Review from './review';

class EditReview extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: [],

            locationKey: '',
            reviewKey: '',

            updated_overall_rating: '',
            updated_price_rating: '',
            updated_quality_rating: '',
            updated_clenliness_rating: '',
            updated_review_body: '',

            image: null,
            displayImage: true,
            toEdit: false
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log("Params", this.props.route.params);
            if (this.props.route.params) {
                this.setState({
                    reviewKey: this.props.route.params.reviewKey,
                    locationKey: this.props.route.params.locationKey
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

    getUserData = async () => {
        const userID = await AsyncStorage.getItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userID, {
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 400) {
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            } else if (response.status === 401) {
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            } else {
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

    updateReviewInfo = async () => {
        let to_send = {};
        let myArray = this.state.userData.reviews;
        let item = myArray.find(item => item.review.review_id === this.state.reviewKey);

        // // // print
        console.log(item.review);
        console.log(item.review.overall_rating);
        console.log(item.updated_overall_rating);

        if (this.state.updated_overall_rating != item.review.overall_rating) {
            to_send['overall_rating'] = parseInt(this.state.updated_overall_rating);
        }

        if (this.state.updated_price_rating != item.review.price_rating) {
            to_send['price_rating'] = parseInt(this.state.updated_price_rating);
        }

        if (this.state.updated_quality_rating != item.review.quality_rating) {
            to_send['quality_rating'] = parseInt(this.state.updated_quality_rating);
        }

        if (this.state.updated_clenliness_rating != item.review.clenliness_rating) {
            to_send['clenliness_rating'] = parseInt(this.state.updated_clenliness_rating);
        }

        if (this.state.updated_review_body != item.review.review_body) {
            to_send['review_body'] = this.state.updated_review_body;
        }

        console.log(to_send);

        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + this.state.reviewKey, {
            method: 'patch',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            if (response.status === 200) {
                return response.text();
            } else if (response.status === 400) {
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            } else if (response.status === 401) {
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            } else if (response.status === 403) {
                ToastAndroid.show("Updating Information That Is Not Yours...", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            } else if (response.status === 404) {
                ToastAndroid.show("Not Found", ToastAndroid.SHORT)
            } else {
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            //idk if this is the right move
            console.log(responseJson);
            ToastAndroid.show("Review Updated", ToastAndroid.SHORT);
            this.props.navigation.navigate("Profile", {screen: "Profile"});
        })
        .catch((error) => {
            console.log(error);
        })
    }

    deleteReview = async (reviewKey) => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + reviewKey, {
            method: 'delete',
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
        })
        .then((response) => {
            if (response.status === 200) {
                return response.text();
            } else if (response.status === 400) {
                ToastAndroid.show("Bad Request", ToastAndroid.SHORT)
            } else if (response.status === 401) {
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 403) {
                ToastAndroid.show("Updating Information That Is Not Yours...", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 404) {
                ToastAndroid.show("Not Found", ToastAndroid.SHORT)
            }else {
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            console.log(responseJson);
            ToastAndroid.show("Review Deleted", ToastAndroid.SHORT);
            this.props.navigation.navigate("Profile", {screen: "Profile"});
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleReviewInfo = (overallRating, priceRating, qualityRating, clenlinessRating, reviewBody) => {
        this.setState({
            updated_overall_rating: overallRating,
            updated_price_rating: priceRating,
            updated_quality_rating: qualityRating,
            updated_clenliness_rating: clenlinessRating,
            updated_review_body: reviewBody,
            toEdit: true
        })
    }

    getReview = () => {
        let myArray = this.state.userData.reviews;
        let item = myArray.find(item => item.review.review_id === this.state.reviewKey);

        // // // print
        console.log(item.review.overall_rating);  
        return item.review;
    }

    getPhoto = async (locationID, reviewID) => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationID + "/review/" + reviewID + "/photo?t=" + new Date().toString(), {
            headers: {
                'Content-Type': 'image/jpeg',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 404){
                ToastAndroid.show("404 - Review Not Found", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            this.setState({
                image: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    deletePhoto = async () => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + this.state.reviewKey + "/photo", {
            method: 'delete',
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 403){
                ToastAndroid.show("Cannot Delete a Photo That Is Not Yours", ToastAndroid.SHORT)
                this.props.navigation.navigate("Login");
            }else if (response.status === 404){
                ToastAndroid.show("404 - Not Found", ToastAndroid.SHORT)
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            console.log(responseJson);
            ToastAndroid.show("Photo Deleted", ToastAndroid.SHORT);
            this.displayAlert()
        })
        .catch((error) => {
            console.log(error);
        })
    }

    displayAlert = () => {
        Alert.alert(
            '',
            'Add New Photo?',  
            [
                {text: 'Cancel', onPress: () => console.log("Cancel Pressed")},
                {text: 'OK', onPress: () => this.props.navigation.navigate("addPhoto")},
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
                <View style={styles.container}>
                    <ActivityIndicator style={styles.loading}/>
                    <TouchableOpacity style={styles.button} onPress={() => this.deleteReview(this.state.reviewKey)}>
                        <Icon
                            name = {'delete'}
                            size = {20}
                        />
                        <Text> Delete Review</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={this.state.userData.reviews}
                        renderItem={({item}) => (
                            <View>
                            {this.state.reviewKey === item.review.review_id ? (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => this.handleReviewInfo(item.review.overall_rating, item.review.price_rating, item.review.quality_rating, item.review.clenliness_rating, item.review.review_body)}>
                                        <Icon
                                            name = {'edit'}
                                            size = {30}
                                        />
                                        <Text> Make Changes To Review</Text>
                                    </TouchableOpacity>

                                    {this.state.toEdit ? (
                                        <View>
                                            <Card>
                                                <CardItem>
                                                    <Left>
                                                        <Text>Enter Overall Rating:</Text>
                                                    </Left>
                                                    <Right>
                                                        <TextInput style={styles.textInput}
                                                            keyboardType={'numeric'}
                                                            placeholder={this.state.updated_overall_rating.toString()}
                                                            onChangeText={(updated_overall_rating) => this.setState({updated_overall_rating})}
                                                            value={this.state.updated_overall_rating}
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
                                                            keyboardType={'numeric'}
                                                            placeholder={this.state.updated_price_rating.toString()}
                                                            onChangeText={(updated_price_rating) => this.setState({updated_price_rating})}
                                                            value={this.state.updated_price_rating}
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
                                                            keyboardType={'numeric'}
                                                            placeholder={this.state.updated_quality_rating.toString()}
                                                            onChangeText={(updated_quality_rating) => this.setState({updated_quality_rating})}
                                                            value={this.state.updated_quality_rating}
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
                                                            keyboardType={'numeric'}
                                                            placeholder={this.state.updated_clenliness_rating.toString()}
                                                            onChangeText={(updated_clenliness_rating) => this.setState({updated_clenliness_rating})}
                                                            value={this.state.updated_clenliness_rating}
                                                        />
                                                    </Right>
                                                </CardItem>
                                            </Card>
                                            <Card>
                                                <CardItem>
                                                    <Left>
                                                        <Text>Enter Review Body:</Text>
                                                    </Left>
                                                    <Right>
                                                        <TextInput style={styles.bodyInput}
                                                            multiline={true}
                                                            maxLength={200}
                                                            placeholder={this.state.updated_review_body.toString()}
                                                            onChangeText={(updated_review_body) => this.setState({updated_review_body})}
                                                            value={this.state.updated_review_body}
                                                        />
                                                    </Right>
                                                </CardItem>
                                            </Card>

                                            <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} onPress = {() => this.deletePhoto()}>
                                                <Icon
                                                    name = {'Delete'}
                                                    size = {20}
                                                />
                                                <Text> Delete Photo </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.button, {justifyContent: 'flex-end'}]} onPress = {() => this.updateReviewInfo()}>
                                            <Text> Save Changes </Text>
                                                <Icon
                                                    name = {'arrowright'}
                                                    size = {20}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    ) : (
                                        <View></View>
                                    )
                                }
                                </View>
                                
                            ) : (
                                <View></View>
                            )}
                            </View>
                        )}
                        keyExtractor={(item) => item.review.review_id.toString()}
                    />

                </View>
            );
        }
    }
}

export default EditReview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 5
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