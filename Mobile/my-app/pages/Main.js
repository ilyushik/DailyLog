import Layout from "../Components/Layout";
import {Dimensions, FlatList, Image, StyleSheet, Text, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import React, {useEffect, useRef, useState} from "react";
import { useSharedValue } from "react-native-reanimated";
import RequestComponent from "./MainComponents/RequestComponent";
import {axiosHelper} from "../axiosHelper";
import axios from "axios";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1hcmFsaWlseWFAZ21haWwuY29tIiwiaWF0IjoxNzUyOTEyNDc5LCJleHAiOjE3NTM1MTcyNzl9.2JFI_AN7co0cewEU12XL-fjj2K8SOaykeBEf1T4fSQU"

const leadToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbGxpYS5rYW1hcmFsaS53b3JrQGdtYWlsLmNvbSIsImlhdCI6MTc1MjkxMjQ0MiwiZXhwIjoxNzUzNTE3MjQyfQ.U0qCz7f7EZCgWAlPfjYGJ22tUU6d4qqnqqW13_GnrdA"

export default function Main() {
    const carouselRef = useRef(null);
    const progress = useSharedValue(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const [user, setUser] = useState({});
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/getMyInfo`, {
                    headers: {
                        Authorization: `Bearer ${leadToken}`,
                    }
                });
                console.log(response.data);
                setUser(response.data);
            } catch (e) {
                console.log("Ошибка при получении пользователя:", e?.response?.data || e.message);
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            setRequests([])
            try {
                const response = await axios.get(`http://localhost:8080/requests`, {
                    headers: {
                        Authorization: `Bearer ${leadToken}`,
                    }
                });
                console.log(response.data);
                setRequests(response.data);
            } catch (e) {
                console.log("Ошибка при получении запросов Main page:", e?.response?.data || e.message);
            }
        };

        fetchData();
    }, []);

    const renderSeparator = () => (
        <View style={styles.separator} />
    );


    const carouselItems = [
        {
            key: 'calendar',
            title: '📅 Calendar',
            content: (
                <View style={{
                    width: screenWidth * 0.9,
                    aspectRatio: '1 / 0.8',
                    backgroundColor: "#fff",
                    borderRadius: 15,
                }}>
                    <View style={{
                        width: screenWidth * 0.9,
                        backgroundColor: '#617DA6',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        padding: 15
                    }}>
                        <Text style={{
                            color: '#eeeeee',
                            fontSize: 15,
                            fontWeight: 500
                        }}>Calendar</Text>
                    </View>

                    <View style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 500,
                        }}>Calendar</Text>
                    </View>
                </View>
            )
        },
        {
            key: 'requests',
            title: '📨 Requests',
            content: (
                <View style={{
                    width: screenWidth * 0.9,
                    // maxHeight: screenHeight * 0.35,
                }}>
                    <View style={{
                        width: screenWidth * 0.9,
                        // height: screenHeight * 0.05,
                        backgroundColor: '#617DA6',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        padding: 15
                    }}>
                        <Text style={{
                            color: '#eeeeee',
                            fontSize: 15,
                            fontWeight: 500
                        }}>Requests</Text>
                    </View>

                    <View style={{
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        maxHeight: screenHeight * 0.3
                    }}>
                        {requests.length === 0 && (
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 500,
                                padding: 15,
                            }}>Still no requests</Text>
                        )}

                        <FlatList data={requests} renderItem={({item}) =>
                            (<RequestComponent requestId={item.id} email={user.email} />
                            )}  keyExtractor={item => item.id}
                                  ItemSeparatorComponent={renderSeparator} refreshing={true}/>
                    </View>
                </View>
            )
        }
    ];

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
                        source={{uri: user.image}}
                        resizeMode="contain"
                    />

                    <View style={styles.mainPageUsernamePositionContainer}>
                        <Text style={styles.mainPageUsername}>
                            {user?.firstName} {user?.secondName}
                        </Text>

                        <View style={styles.mainPagePositionContainer}>
                            <Ionicons name="briefcase-outline" size={20} color="#696969" />

                            <Text style={styles.mainPagePosition}>{user?.position}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.carouselContainer}>
                    <Carousel
                        ref={carouselRef}
                        width={screenWidth}
                        data={carouselItems}
                        scrollAnimationDuration={1000}
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
        maxHeight: screenHeight * 0.4,
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 10
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
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    }
});