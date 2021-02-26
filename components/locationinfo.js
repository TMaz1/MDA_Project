import React, {Component} from 'react';
import {ActivityIndicator, View, Text, StyleSheet, ToastAndroid, FlatList, Image, Button, Alert, TouchableOpacity} from 'react-native';
import {Container, Card} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Review from './review';

class LocationInfo extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            locationData: [],
            userData: [],
            locationKey: '',
            image: null,
            displayImage: true,
            liked: false, 
            favourited: false
        } 
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log("Params", this.props.route.params);
            if(this.props.route.params){
                const {Key} = this.props.route.params
                this.setState({
                    locationKey: Key
                })
            }
            this.checkLoggedIn();
            this.getLocationData();
            this.getUserData();
        })
        this.checkLoggedIn();
        this.getLocationData();
        this.getUserData();

    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("Login");
        }
    };

    getLocationData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey, {
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json();
            }else if (response.status === 404){
                ToastAndroid.show("Location Information Not Found", ToastAndroid.SHORT)
                this.props.navigation.navigate("Home", {screens: "DisplayLocations"});
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                locationData: responseJson
            }); 
        })
        .catch((error) => {
            console.log(error)
        });
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
                userData: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    favouriteLocation = async () => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey.toString() + "/favourite", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if (response.status === 200){
                return response.text()
            }else if (response.status === 400){
                ToastAndroid.show("Invalid Location ID", ToastAndroid.SHORT);
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT);
            }else if (response.status === 404){
                ToastAndroid.show("Not Found - Location ID does not exist", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .catch((error) =>  {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        }) 
    }

    unfavouriteLocation = async (locationKey) => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + locationKey.toString() + "/favourite", {
            method: 'delete',
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.text();
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
            console.log(JSON.stringify(responseJson));
            ToastAndroid.show("Location Unfavourited", ToastAndroid.SHORT);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    likeReview = async (reviewID) => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + reviewID + "/like", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if (response.status === 200){
                return response.text()
            }else if (response.status === 400){
                ToastAndroid.show("Cannot Like Review", ToastAndroid.SHORT);
            }else if (response.status === 401){
                ToastAndroid.show("Unauthorised", ToastAndroid.SHORT);
            }else if (response.status === 404){
                ToastAndroid.show("Not Found - Review does not exist", ToastAndroid.SHORT);
            }else{
                throw 'Something is wrong with the server!';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            ToastAndroid.show("Review Liked!", ToastAndroid.SHORT);

            // const likeData = data.map(item => {
            //     if (item.id === responseJson.id){
            //         return responseJson
            //     }else{
            //         return item
            //     }
            // })
            // this.setState({
            //     liked: likeData 
            // });
        })
        .catch((error) =>  {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        }) 
    }

    unlikeReview = async (reviewID) => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.locationKey + "/review/" + reviewID + "/like", {
            method: 'delete',
            headers: {
                'X-Authorization': await AsyncStorage.getItem('@session_token')
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.text();
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
            ToastAndroid.show("Review Unliked", ToastAndroid.SHORT);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    checkLiked = (val) => {
        return this.state.userData.liked_reviews.some(item => val.review_id === item.review_id);
    }

    checkFaved = () => {
        this.state.userData.favourite_locations.map(item => {
            return item.location_id.includes(this.state.locationKey)
        })
    }

    getLiked = (val) => {
        const likeData = this.state.userData.liked_reviews.map(item => {
            if (item.review.review_id === val.review_id){
                    return val
                }else{
                    return item
                }
             })
             this.setState({
                 likedData: likeData 
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
                    <Card style={styles.card}>
                        <Text>Location Name: {this.state.locationData.location_name}</Text>
                        <Text>Location Town: {this.state.locationData.location_town}</Text>

                        <Text>user first name: {this.state.userData.first_name}</Text>
                    
                        
                        <Text></Text>
                        <Text>Average Overall Rating: {this.state.locationData.avg_overall_rating}</Text>
                        <Text>Average Price Rating: {this.state.locationData.avg_price_rating}</Text>
                        <Text>Average Quality Rating: {this.state.locationData.avg_quality_rating}</Text>
                        <Text>Average Cleanliness Rating: {this.state.locationData.avg_clenliness_rating}</Text>
                    </Card>
                    
                    
                    
                    
                    {/* if contains location id
                        fill heart/favourite location
                    else
                        unfill heart/unfav location */}

                    <TouchableOpacity style={styles.button} onPress={() => this.favouriteLocation()}>
                        <Icon
                            name = {'staro'}
                            size = {20}
                        />
                        <Text> Favourite Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => this.unfavouriteLocation(this.state.locationKey)}>
                        <Icon
                            name = {'star'}
                            size = {20}
                        />
                        <Text> unfavourite Location</Text>
                    </TouchableOpacity>

                    {/* {this.checkFaved() ? (
                        <TouchableOpacity style={styles.button} onPress={() => this.unfavouriteLocation(this.state.locationKey)}>
                            <Icon
                                name = {'star'}
                                size = {20}
                            />
                            <Text> unfavourite Location</Text>
                        </TouchableOpacity>
                    )
                    : (
                        <TouchableOpacity style={styles.button} onPress={() => this.favouriteLocation()}>
                            <Icon
                                name = {'staro'}
                                size = {20}
                            />
                            <Text> Favourite Location</Text>
                        </TouchableOpacity>
                    )
                    }  */}

                    
                    <Text>Fav locations:</Text>
                    <FlatList
                        data={this.state.userData.favourite_locations}
                        renderItem={({item}) => (
                            <Text>{item.location_id}: {item.location_name}</Text>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />

                    

                    

                    <Button
                        title="Add Review"
                        onPress={() => navigation.navigate("AddReview", {
                            "locationKey": this.state.locationKey.toString(),
                            "locationNameKey": this.state.locationData.location_name.toString()
                        })}
                    />

                    {/* {this.state.userData.liked_reviews.includes(item.review_id) ? (
                        this.setState({
                            liked: true
                        })
                    )
                    : (
                        this.setState({
                            liked: false
                        })
                    )
                    } */}
                    
                    <Text>Location Reviews:</Text>
                    <FlatList
                        data={this.state.locationData.location_reviews}
                        renderItem={({item}) => (
                            <Review
                                liked = {this.state.liked}
                                onPress={() => this.likeReview(item.review_id)}
                                review_id = {item.review_id}
                                overall_rating = {item.overall_rating}
                                price_rating = {item.price_rating}
                                quality_rating = {item.quality_rating}
                                clenliness_rating = {item.clenliness_rating} 
                                review_body = {item.review_body}
                                likes = {item.likes}
                                photo_path = {{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                            />
                        )}
                        keyExtractor={(item) => item.review_id.toString()}
                    />

                </Container>
            );
        }
    }
}

export default LocationInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    card: {
        padding: 10
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    }
});