import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Title, Card, CardItem, Left, Right, Subtitle} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';

class Review extends Component{
    constructor(props){
        super(props);

        this.state = {
            displayImage: true
        }
    }

    onErrorLoadingImage = () => {
        this.setState({displayImage: false})
    }

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
                            
                            {this.state.displayImage ? (
                                <Image
                                    style = {styles.image}
                                    source = {this.props.photo_path}
                                    onError={this.onErrorLoadingImage}
                                />
                            ) : (
                                <View></View>
                            )}

                            <Subtitle style={[styles.text, {paddingTop: 15}]}>Price Rating: {this.props.price_rating}</Subtitle>
                            <Subtitle style={styles.text}>Quality Rating: {this.props.quality_rating}</Subtitle>
                            <Subtitle style={styles.text}>Cleanliness Rating: {this.props.clenliness_rating}</Subtitle>
                        </View> 
                    </Left>

                    <Right>
                        {this.props.isUsers ? (
                            <View>
                                <TouchableOpacity style={styles.button} key={this.props.review_id} onPress={this.props.onPress}>
                                <Icon
                                    name = {'edit'}
                                    size = {20}
                                />
                                <Text> Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <TouchableOpacity style={styles.button} key={this.props.review_id} onPress={this.props.onPressUnlike}>
                                    <Icon
                                        name = {'like1'}
                                        size = {20}
                                    />
                                    <Text> Unlike</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} key={this.props.review_id} onPress={this.props.onPressLike}>
                                <Icon
                                    name = {'like2'}
                                    size = {20} 
                                />
                                <Text> Like</Text>
                                </TouchableOpacity>
                                <Subtitle style={styles.text}>Likes ({this.props.likes})</Subtitle>
                            </View>
                        )
                        }

                        {/* {this.props.liked ? (
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
                        )} */}
   
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
        paddingLeft: 10,
    },
    reviewText: {
        color: 'black',
        paddingBottom: 3,
        fontSize: 16,
        width: 220
    },
    button: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 5
    },
    reviewImage: {
        borderRadius: 8,
        maxWidth: 100,
        height: 'auto'
    },
});