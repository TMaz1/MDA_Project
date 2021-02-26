import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: [],
            locationsData: null,
            loadingExtraData: false,
            limit: 2,
            offset: 0
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        return fetch('http://10.0.2.2:3333/api/1.0.0/find?limit=' + this.state.limit + '&offset=' + this.state.offset , {
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
        .then(responseJson => {
            this.setState({
                locationsData: this.state.offset === 0 ? 
                responseJson.results : [...this.state.locationsData, ...responseJson.results]
            });
        })
        .catch((error) => {
            console.log(error)
        });
    }

    loadMoreData = () =>{
        this.setState({
            offset: this.state.offset+2
        },
        ()=>this.getData())
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.locationsData}
                    renderItem={({item}) => (
                        <View>
                            <Text>ID: {item.location_id}</Text>
                            <Text>{item.location_name}</Text>
                            <Text>Overall Rating: {item.avg_overall_rating}</Text>
                            <Text>Price Rating: {item.avg_price_rating}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.location_id.toString()}
                    // onEndReachedThreshold={0}
                    // onEndReached={this.loadMoreData}
                />
            </View>
        )
    }
}

export default Pagination;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    loading: {
        color: '#ab7343'
    }
});