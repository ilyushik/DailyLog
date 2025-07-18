import Layout from "../Components/Layout";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import React, { useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";

const user = {
    firstName: "Illia",
    secondName: "Kamarali",
    position: "Java Software Engineer",
    image: "../assets/images/img.png"
};

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const carouselItems = [
    {
        key: 'calendar',
        title: '📅 Calendar',
        content: (
            <View style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.35,
                backgroundColor: '#f2f2f2',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text>Calendar</Text>
            </View>
        )
    },
    {
        key: 'requests',
        title: '📨 Requests',
        content: (
            <View style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.35,
                backgroundColor: '#f2f2f2',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text>Requests</Text>
            </View>
        )
    }
];

export default function Main() {
    const ref = useRef(null);
    const progress = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0); // добавлено

    const onPressPagination = (index) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    const renderPaginationDots = () => (
        <View style={styles.dotsContainer}>
            {carouselItems.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        activeIndex === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
            ))}
        </View>
    );

    return (
        <Layout>
            <View style={styles.mainContainer}>
                <View style={styles.avatarNamePositionContainer}>
                    <Image
                        style={styles.mainPageAvatar}
                        source={require('../assets/images/img.png')}
                        resizeMode="contain"
                    />

                    <View style={styles.mainPageUsernamePositionContainer}>
                        <Text style={styles.mainPageUsername}>
                            {user.firstName} {user.secondName}
                        </Text>

                        <View style={styles.mainPagePositionContainer}>
                            <Ionicons name="briefcase-outline" size={20} color="#696969" />

                            <Text style={styles.mainPagePosition}>{user.position}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.carouselContainer}>
                    <Carousel
                        ref={ref}
                        width={screenWidth}
                        height={screenHeight * 0.35}
                        data={carouselItems}
                        scrollAnimationDuration={1000}
                        // onProgressChange={(_, absoluteProgress) => {
                        //     progress.value = absoluteProgress;
                        // }}
                        onSnapToItem={(index) => setActiveIndex(index)}
                        renderItem={({ item }) => (
                            <View style={styles.carouselItem}>
                                {item.content}
                            </View>
                        )}
                        loop={false}
                        vertical={false}/>

                    {renderPaginationDots()}
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#e3e3e3',
    },
    avatarNamePositionContainer: {
        alignItems: 'center',
        top: -screenHeight * 0.065,
    },
    mainPageAvatar: {
        borderRadius: (screenWidth * 0.27) / 2,
        height: screenWidth * 0.27,
        width: screenWidth * 0.27,
        borderColor: '#e3e3e3',
        borderWidth: 3,
    },
    mainPageUsernamePositionContainer: {
        marginTop: 5,
        gap: 10,
        alignItems: 'center'
    },
    mainPageUsername: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000"
    },
    mainPagePositionContainer: {
        flexDirection: "row",
        gap: 5,
        alignItems: 'center'
    },
    mainPagePosition: {
        fontSize: 15,
        color: "#696969"
    },
    carouselContainer: {
        alignItems: 'center',
        top: -screenHeight * 0.04,
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    activeDot: {
        backgroundColor: '#617DA6',
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },

});