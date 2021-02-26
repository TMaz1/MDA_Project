import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Image} from 'react-native';
import {Container, Header, Body, Title, Card, CardItem, Left, Right, Content, Subtitle} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

class Review extends Component{
    render(){
        const navigation = this.props.navigation;

        return(
            <Card>
                <CardItem>
                    <Left>
                        
                        <View style={styles.reviewDetails}>
                            <Subtitle style={[styles.reviewText, {paddingBottom: 5}]}> Review ID: {this.props.review_id}</Subtitle>
                            <Title style={[styles.reviewText, {fontWeight: 'bold'}]}> Overall Rating: {this.props.overall_rating}</Title>
                            <Text style={[styles.reviewText, {fontStyle: 'italic', paddingBottom: 15}]}>"{this.props.review_body}"</Text>
                            

                            <Image
                                style = {styles.image}
                                source = {this.props.photo_path}
                            />

                            <Subtitle style={[styles.text, {paddingTop: 15}]}>Price Rating: {this.props.price_rating}</Subtitle>
                            <Subtitle style={styles.text}>Quality Rating: {this.props.quality_rating}</Subtitle>
                            <Subtitle style={styles.text}>Cleanliness Rating: {this.props.clenliness_rating}</Subtitle>
                        </View> 
                    </Left>

                    <Right>
                        {this.props.isUsers ? (
                            <TouchableOpacity style={[styles.button, {justifyContent: 'flex-start'}]} key={this.props.review_id} onPress={this.props.onPress}>
                            <Icon
                                name = {'edit'}
                                size = {20}
                            />
                            <Text> Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text></Text>
                        )
                        }

                        {this.props.liked ? (
                            <TouchableOpacity style={styles.button} key={this.props.review_id} onPress={this.props.onPress}>
                                <Icon
                                    name = {'like1'}
                                    size = {20}
                                />
                                <Text> Unlike</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} key={this.props.review_id} onPress={this.props.onPress}>
                                <Icon
                                    name = {'like2'}
                                    size = {20}
                                />
                                <Text> Like</Text>
                            </TouchableOpacity>
                        )}
                        <Subtitle style={styles.text}>Likes ({this.props.likes})</Subtitle>
                    </Right>
                </CardItem>
            </Card>
        );
    }
}

export default Review;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5edda'
    },
    image: {
        width: 200,
        height: 180,
        borderRadius: 5,
        paddingRight: 5
    },
    reviewDetails: {
        alignItems: 'flex-start',
        marginLeft: 15 
    },
    value: {
        alignItems: 'flex-end',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        color: 'black',
        paddingBottom: 3
    },
    reviewText: {
        color: 'black',
        paddingBottom: 3,
        fontSize: 16,
        width: 340
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    }
});