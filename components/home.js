import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {Container, Header, Body, Title, Card, CardItem, Left, Right, Icon, Content, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Location from './location';

class Home extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <Container style={styles.container}>
                <Content>
                    <Card>
                        <CardItem>
                            <Icon name="map"/>
                            <Title style={styles.text}>List of Locations:</Title>
                        </CardItem>
                    </Card>

                    <Location
                        onPress={() => navigation.navigate('LocationInfo')}
                        location_name="Aunt Mary's Great Coffee Shop"
                        location_town="London"
                        avg_overall_rating="4.5"
                        //photo_path="http://cdn.coffida.com/images/78346822.jpg"
                        photo_path={{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                    />
                    
                    <Location
                    //TEMP VARIABLE
                        onPress={() => navigation.navigate('LocationInfo')}
                        location_name="Larry's Coffee Shop"
                        location_town="Glasgow"
                        avg_overall_rating="4.2"
                        photo_path={{uri:"https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG"}}
                    />

                    <Button
                        title="Info about Location"
                        onPress={() => navigation.navigate('LocationInfo')}
                    />
                </Content>
            </Container>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    text: {
        color: 'black',
        fontWeight: 'bold'
    }
});