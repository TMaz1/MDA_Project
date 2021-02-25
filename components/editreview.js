import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class ReviewInfo extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text>Information About Specific Review Screen</Text>
                <Button
                    title="click here"
                    onPress={() => alert('Button Clicked!')}
                />
            </View>
        );
    }
}

export default ReviewInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    }
});