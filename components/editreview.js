import React, {Component} from 'react';
import {ActivityIndicator , View, Text, Button, Alert, TextInput, StyleSheet, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            displayImage: true
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
                //isLoading: false,
                userData: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    updateReviewInfo = async () => {
        let to_send = {};

        if (this.state.updated_overall_rating != this.state.userData.reviews.review.overall_rating){
            to_send['overall_rating'] = parseInt(this.state.updated_overall_rating);
        }

        if (this.state.updated_price_rating != this.state.userData.reviews.review.price_rating){
            to_send['price_rating'] = parseInt(this.state.updated_price_rating);
        }

        if (this.state.updated_quality_rating != this.state.userData.reviews.review.quality_rating){
            to_send['quality_rating'] = parseInt(this.state.updated_quality_rating);
        }

        if (this.state.updated_clenliness_rating != this.state.userData.reviews.review.clenliness_rating){
            to_send['clenliness_rating'] = parseInt(this.state.updated_clenliness_rating);
        }

        if (this.state.updated_review_body != this.state.userData.reviews.review.review_body){
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
            ToastAndroid.show("Review Updated", ToastAndroid.SHORT);
            this.props.navigation.navigate("Profile");
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
            console.log(responseJson);
            ToastAndroid.show("Review Deleted", ToastAndroid.SHORT);
            this.props.navigation.navigate("DisplayProfile");
        })
        .catch((error) => {
            console.log(error);
        })
    }


    render(){
        const navigation = this.props.navigation;
        const array1 = [5, 12, 8, 130, 44];

        //const found = this.state.userData.reviews.find(element => element.review.review_id === this.state.reviewKey);
        //console.log(found);

        // let arr = this.state.userData.reviews
        // let obj = arr.find(o => o.review.review_id === 4);
        // console.log(obj);
        
        // let o = { name: 'foobar' };
        // let arr = [3, o, 4, 5];

        // let p = arr.find(function(x){
        //         console.log(this)
        //         return x === this
        // }, o);

        // console.log("found:", p)

        if(this.state.isLoading){
            return (
                <View style={styles.container}>
                    <ActivityIndicator style={styles.loading}/>
                    <Text>Test: {this.state.reviewKey} === {this.state.userData.reviews.review.review_id}?</Text> */}
                </View>
            )
        }else{
            return (
                <View>
                    <Button
                        title="Delete Review"
                        onPress={() => this.deleteReview(this.state.reviewKey)}
                        //if user deletes review, then they gotta delete photo too right?
                        //callback function?
                    />
{/* 
                    <Text>Update Review</Text>

                    <Text>Location Name: {this.state.userData.reviews.location.location_name}</Text>

                    <Text>Overall Rating:</Text>
                    <TextInput
                        placeholder={this.state.userData.reviews.review.overall_rating}
                        onChangeText={(updated_overall_rating) => this.setState({updated_overall_rating})}
                        value={this.state.updated_overall_rating}
                    />

                    <Text>Price Rating:</Text>
                    <TextInput
                        placeholder={this.state.userData.reviews.review.price_rating}
                        onChangeText={(updated_price_rating) => this.setState({updated_price_rating})}
                        value={this.state.updated_price_rating}
                    />

                    <Text>Quality Rating:</Text>
                    <TextInput
                        placeholder={this.state.userData.reviews.review.quality_rating}
                        onChangeText={(updated_quality_rating) => this.setState({updated_quality_rating})}
                        value={this.state.updated_quality_rating}
                    />

                    <Text>Cleanliness Rating:</Text>
                    <TextInput
                        placeholder={this.state.userData.reviews.review.clenliness_rating}
                        onChangeText={(updated_clenliness_rating) => this.setState({updated_clenliness_rating})}
                        value={this.state.clenliness_rating}
                    />

                    <Text>Review Body:</Text>
                    <TextInput
                        placeholder={this.state.userData.reviews.review.review_body}
                        onChangeText={(updated_review_body) => this.setState({updated_review_body})}
                        value={this.state.updated_review_body}
                    />
                    <Button
                        title="Save Changes"
                        onPress={() => this.updateReviewInfo()}
                    />

                    <Text>Test: {this.state.reviewKey} === {this.state.userData.reviews.review.review_id}?</Text> */}
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
    }
});