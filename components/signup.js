import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class Signup extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text>Signup Screen</Text>
                <Button
                    title="click here"
                    onPress={() => alert('Button Clicked!')}
                />
            </View>
        );
    }
}

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    }
});