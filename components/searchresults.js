import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class SearchResults extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text>Search Result Screen</Text>
                <Button
                    title="Display Location"
                    onPress={() => navigation.navigate("Home",  {screen: "LocationInfo"})}
                />
            </View>
        );
    }
}

export default SearchResults;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    }
});