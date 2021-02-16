import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {Container, Header, Body, Title, Card, CardItem, Left, Right, Icon, Content, Thumbnail, Subtitle} from 'native-base';

class Location extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <TouchableOpacity key={this.props.location_name} onPress={this.props.onPress}>    
            <Card pointerEvents="none">
                <CardItem>
                    {/* button onPress={() => alert('Button Clicked!')} 
                button onPress={() => navigation.navigate('Reviewinfo')}*/}
                    <Left>
                        <Thumbnail
                            //source={require('./photos/coffee.jpg')}
                            style = {styles.image}
                            source = {this.props.photo_path}
                        />
                        <View style={styles.locationDetails}>
                            <Title style={[styles.text, {fontWeight: 'bold', fontSize: 17}]}>{this.props.location_name}</Title>
                            <Subtitle style={styles.text}>{this.props.location_town}</Subtitle>
                        </View>
                    </Left>

                    <Right>
                        <View style={styles.locationFavourite}>
                            <Text style={styles.value}>{this.props.avg_overall_rating}</Text>
                            {/* <Icon name="star"/> */}
                        </View>
                    </Right>
                </CardItem>
            </Card>
            </TouchableOpacity>
        );
    }
}

export default Location;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    image: {
        width: 90,
        height: 70,
        borderRadius: 15
    },
    locationDetails: {
        alignItems: 'flex-start',
        marginLeft: 15 
    },
    value: {
        alignItems: 'flex-end',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        color: 'black'
    }
});