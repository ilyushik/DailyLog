import {Dimensions, Image, Platform, StyleSheet, View} from "react-native";
import Header from "./Header";

export default function Layout(props) {
    return (
        <View style={styles.layoutContainer}>
            <Header/>

            <Image style={styles.banner} source={require('../assets/images/banner.png')}
                   resizeMode="cover"/>

            <View style={styles.contentContainer}>
                {props.children}
            </View>
        </View>
    )
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    layoutContainer: {
        backgroundColor: '#e3e3e3',
        flex: 1,
        marginTop: Platform.OS === "android" ? 50 : 0,
    },
    banner: {
        height: screenHeight * 0.15,
        width: screenWidth,
    },
    contentContainer: {
        paddingHorizontal: screenWidth * 0.1,
    }
});