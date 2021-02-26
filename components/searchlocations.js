import React, {Component} from 'react';
import {ActivityIndicator, View, Text, StyleSheet, Button, ToastAndroid, FlatList, TouchableOpacity} from 'react-native';
import {Container, Header, Input, Card, CardItem, Left, Right} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {AirbnbRating} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Location from './location';

class Search extends Component{
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            locationsData: [],
            q: '',
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            reviewed: '',
            favourite: '',
            displayReviews: false, 
            displayFavs: false
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => { 
            this.checkLoggedIn();
            this.getData("http://10.0.2.2:3333/api/1.0.0/find");
            
        })
        this.checkLoggedIn();
        this.getData("http://10.0.2.2:3333/api/1.0.0/find");
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("Login");
        }
    };

    getData = async (url) => {
        return fetch(url, {
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
                locationsData: responseJson
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    search = () => {
        let url = "http://10.0.2.2:3333/api/1.0.0/find?"

        console.log(this.state.q);
        console.log(this.state.overall_rating);
        console.log(this.state.price_rating);
        console.log(this.state.quality_rating);
        console.log(this.state.clenliness_rating);

        if(this.state.q != ''){
            url += "q=" + this.state.q + "&";
        }

        if(this.state.displayReviews){
            url += "search_in=reviewed" + this.state.reviewed + "&"
        }

        if(this.state.displayFavs){
            url += "search_in=favourite" + this.state.favourite + "&"
        }

        if(this.state.overall_rating > 0){
            url += "overall_rating=" + this.state.overall_rating + "&"
        }

        if(this.state.price_rating > 0){
            url += "price_rating=" + this.state.price_rating + "&"
        }

        if(this.state.quality_rating > 0){
            url += "quality_rating=" + this.state.quality_rating + "&"
        }

        if(this.state.clenliness_rating > 0){
            url += "clenliness_rating=" + this.state.clenliness_rating + "&"
        }

        this.getData(url);
    }

    ratingCompleted(rating, name){
        let stateObject = () => {
            let returnObject = {};
            returnObject[name] = rating;
            return returnObject;
        };
        this.setState(this.stateObject);
    }

    resetState = () => {
        this.setState = ({
            isLoading: true,
            locationsData: [],
            q: '',
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            reviewed: '',
            favourite: '',
            displayReviews: false, 
            displayFavs: false
        })

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
                    <Text></Text>
                    <View style={styles.searchBar}>
                        <Input styles={styles.textInput}
                            placeholder="Type Here..."
                            value={this.state.q}
                            onChangeText={(q) => this.setState({q: q})}
                        />
                        <Icon.Button
                            name = {'search1'}
                            size = {20}
                            style = {styles.icon}
                            color = '#000'
                            onPress={() => this.search()}
                        />
                        <Icon.Button
                            name = {'delete'}
                            size = {20}
                            style = {styles.icon}
                            color = '#000'
                            onPress={() => this.resetState()}
                        />

                    </View>

                    <Button
                        title="pagination"
                        onPress={() => navigation.navigate("SearchResults")}
                    />

                    <Card>
                        <CardItem>
                            <Left>  
                                <TouchableOpacity style={styles.button} onPress={() => this.setState({displayFavs: true})}>
                                    {this.state.displayFavs ? (
                                        <Icon
                                            name = {'checksquare'}
                                            size = {20}
                                        />
                                    ) : (
                                        <Icon
                                            name = {'checksquareo'}
                                            size = {20}
                                        />
                                    )}
                                    <Text> Reviewed </Text>
                                </TouchableOpacity>
                            </Left>
                            <Right>
                                <TouchableOpacity style={styles.button} onPress={() => this.setState({displayReviews: true})}>
                                    {this.state.displayReviews ? (
                                        <Icon
                                            name = {'checksquare'}
                                            size = {20}
                                        />
                                    ) : (
                                        <Icon
                                            name = {'checksquareo'}
                                            size = {20}
                                        />
                                    )}
                                    <Text> Favourited </Text>
                                </TouchableOpacity>
                            </Right>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem>
                            <Left>
                                <Text style={styles.searchText}>Overall Rating:</Text>
                            </Left>
                            <Right>
                                <AirbnbRating
                                    size={18}
                                    defaultRating={0}
                                    showRating={false}
                                    onFinishRating={(rating) => this.ratingCompleted(rating, "overall_rating")}
                                />
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <Text style={styles.searchText}>Price Rating:</Text>
                            </Left>
                            <Right>
                                <AirbnbRating
                                    size={18}
                                    defaultRating={0}
                                    showRating={false}
                                    onFinishRating={(rating) => this.ratingCompleted(rating, "price_rating")}
                                />
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <Text style={styles.searchText}>Quality Rating:</Text>
                            </Left>
                            <Right>
                                <AirbnbRating
                                    size={18}
                                    defaultRating={0}
                                    showRating={false}
                                    onFinishRating={(rating) => this.ratingCompleted(rating, "quality_rating")}
                                />
                            </Right>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <Text style={styles.searchText}>Cleanliness Rating:</Text>
                            </Left>
                            <Right>
                                <AirbnbRating
                                    size={18}
                                    defaultRating={0}
                                    showRating={false}
                                    onFinishRating={(rating) => this.ratingCompleted(rating, "clenliness_rating")}
                                />
                            </Right>
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

                    
                </View>
            );
        }
    }
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#f5edda',
        padding: 5, 
        borderWidth: 1, 
        margin: 5,
        borderRadius: 10
    },
    icon: {
        backgroundColor: '#f5edda',
        paddingVertical: 15
    },
    searchText: {
        color: '#000',
        fontSize: 16
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});