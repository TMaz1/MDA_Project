import AsyncStorage from '@react-native-async-storage/async-storage';

checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate("Login");
    }
};