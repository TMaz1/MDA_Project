import React, {Component} from 'react';
import {ActivityIndicator, ToastAndroid, FlatList, View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Location from './location';
import Review from './review';

class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: [],
            isUsers: true,

            image: null,
            displayImage: true,

            displayFavs: false,
            displayReviews: false,
            displayLiked: false
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.checkLoggedIn();
            this.getUserData();
        })
        this.checkLoggedIn();
        this.getUserData();
        this.setState({displayReviews: true});
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
                isLoading: false,
                userData: responseJson
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
                <View style={styles.container}>
                    <View style={styles.header}>

                    <View style={styles.profileContainer}>
                        <View>
                            <Text style={styles.headerText}>{this.state.userData.user_id} {this.state.userData.first_name} {this.state.userData.last_name}</Text>
                            <Text style={styles.emailText}>{this.state.userData.email}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
                                <Icon
                                    name = {'edit'}
                                    size = {20}
                                    color = 'white'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                        <View style={styles.backgroundIcon}>
                            <FontAwesome5
                                name = {'coffee'}
                                size = {55}
                                //color = '#65350f'
                            />
                        </View>
                    </View>
                    
                    <View style={styles.footer}>
                        <View style={styles.footerHeader}>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({displayReviews: true, displayLiked: false, displayFavs: false})}>
                                {this.state.displayReviews ? (
                                    <Icon
                                        name = {'pushpin'}
                                        size = {20}
                                    />
                                ) : (
                                    <Icon
                                        name = {'pushpino'}
                                        size = {20}
                                    />
                                )}
                                <Text> Reviews   </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({displayReviews: false, displayLiked: false, displayFavs: true})}>
                                {this.state.displayFavs ? (
                                    <Icon
                                        name = {'star'}
                                        size = {20}
                                    />
                                ) : (
                                    <Icon
                                        name = {'staro'}
                                        size = {20}
                                    />
                                )}
                                
                                <Text> Favourites   </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({displayReviews: false, displayLiked: true, displayFavs: false})}>
                                {this.state.displayLiked ? (
                                    <Icon
                                        name = {'heart'}
                                        size = {20}
                                    />
                                ) : (
                                    <Icon
                                        name = {'hearto'}
                                        size = {20}
                                    />
                                )}
                                <Text> Liked </Text>
                            </TouchableOpacity>
                        </View>


                        {this.state.displayFavs ? (
                            <FlatList
                                data={this.state.userData.favourite_locations}
                                renderItem={({item}) => (
                                    <Location
                                        onPress={() => navigation.navigate("Home", {screen: "LocationInfo"}, {
                                            "Key": item.location_id.toString()
                                        })}
                                        location_name = {item.location_name}
                                        location_town =  {item.location_town}
                                        avg_overall_rating = {item.avg_overall_rating}
                                        photo_path={{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                                    /> 
                                )}
                                keyExtractor={(item) => item.location_id.toString()} //is this a suitable keyextractor?
                            />
                        ) : (
                            <Text></Text>
                        )}

                        {this.state.displayReviews ? (
                            <FlatList
                                data={this.state.userData.reviews}
                                renderItem={({item}) => (
                                    <Review
                                        isUsers = {this.state.isUsers}
                                        onPress={() => navigation.navigate("EditReview", {
                                            "reviewKey": item.review.review_id,
                                            "locationKey": item.location.location_id
                                        })}
                                        review_id = {item.review.review_id}
                                        overall_rating = {item.review.overall_rating}
                                        price_rating = {item.review.price_rating}
                                        quality_rating = {item.review.quality_rating}
                                        clenliness_rating = {item.review.clenliness_rating} 
                                        review_body = {item.review.review_body}
                                        likes = {item.review.likes}
                                        photo_path = {{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                                    />
                                )}
                                keyExtractor={(item) => item.review.review_id.toString()}
                            />
                        ) : (
                            <Text></Text>
                        )}

                        {this.state.displayLiked ? (
                            <FlatList
                                data={this.state.userData.liked_reviews}
                                renderItem={({item}) => (
                                    <Review
                                        review_id = {item.review.review_id}
                                        overall_rating = {item.review.overall_rating}
                                        price_rating = {item.review.price_rating}
                                        quality_rating = {item.review.quality_rating}
                                        clenliness_rating = {item.review.clenliness_rating} 
                                        review_body = {item.review.review_body}
                                        likes = {item.review.likes}
                                        photo_path = {{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                                    />
                                )}
                                keyExtractor={(item) => item.review.review_id.toString()}
                            />
                        ) : (
                            <Text></Text>
                        )}
                    


          
                    </View> 
                </View>
            );
        }
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    emailText: {
        color: 'white',
        fontSize: 14,
        paddingBottom: 14
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    backgroundIcon: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: 100,
        height: 100,
        borderRadius: 100/2
    },
    footer: {
        flex: 2,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    footerHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 5
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    }
});