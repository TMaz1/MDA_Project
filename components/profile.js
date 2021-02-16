import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class Profile extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text>User Profile Screen</Text>
                <Button
                //check: click drawer from profile, then click profile, then click "home": does not go to home
                    title="Drawer"
                    onPress={() => navigation.toggleDrawer()}
                />
                <Button
                    title="Edit Profile"
                    onPress={() => navigation.navigate('EditProfile')}
                />
                <Button
                    title="List of Reviews"
                    onPress={() => alert('Button Clicked!')}
                />
                <Button
                    title="List of Fav Locations?"
                    onPress={() => alert('Button Clicked!')}
                />
                <Button
                    title="Sign Out"
                    onPress={() => alert('Button Clicked!')}
                />
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    }
});