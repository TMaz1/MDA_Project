import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {Container, Header, Input} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

class Search extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Icon
                    name = {'search1'}
                    size = {20}
                    style = {styles.icon}
                />
                <Input
                    placeholder="Search here..."
                />
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate("SearchResults", {"searchValue": this.state.SearchValue})}>
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f5edda'
    },
    icon: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 5
    },
    button: {
        backgroundColor: '#2e1503',
        padding: 15
    },
    searchText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15
    }
});