import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class EditProfile extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text>Edit User Profile Screen</Text>
                <Button
                    title="Pen Icon"
                    onPress={() => alert('Button Clicked!')}
                />
            </View>
        );
    }
}

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    }
});