import React, {useState, useEffect} from "react";
import {View, StyleSheet, Text, Pressable, Image, Dimensions} from "react-native";
import axios from "axios";
import {Ionicons} from "@expo/vector-icons";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1hcmFsaWlseWFAZ21haWwuY29tIiwiaWF0IjoxNzUyOTEyNDc5LCJleHAiOjE3NTM1MTcyNzl9.2JFI_AN7co0cewEU12XL-fjj2K8SOaykeBEf1T4fSQU"

const leadToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbGxpYS5rYW1hcmFsaS53b3JrQGdtYWlsLmNvbSIsImlhdCI6MTc1MjkxMjQ0MiwiZXhwIjoxNzUzNTE3MjQyfQ.U0qCz7f7EZCgWAlPfjYGJ22tUU6d4qqnqqW13_GnrdA"

export default function InboxComponent(props) {
    const [request, setRequest] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setRequest([])
            try {
                const response =
                    await axios.get(`http://localhost:8080/requests/request/${props.requestId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${leadToken}`,
                            }
                        });
                console.log(response.data);
                setRequest(response.data);
            } catch (e) {
                console.log("Ошибка при получении запроса Inbox Component:", e?.response?.data || e.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!request.user) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/${request.user}`, {
                    headers: {
                        Authorization: `Bearer ${leadToken}`,
                    }
                });
                setUser(response.data);
            } catch (e) {
                console.log("Ошибка при получении юзера Inbox Component:", e?.response?.data);
            }
        };

        fetchData();
    }, [request.user]); //



    function countDaysInclusiveWithLabel(date1Array, date2Array) {
        if (!date1Array || !date2Array) return "";

        const date1 = new Date(date1Array[0], date1Array[1] - 1, date1Array[2]);
        const date2 = new Date(date2Array[0], date2Array[1] - 1, date2Array[2]);

        const diffInMs = Math.abs(date2 - date1);
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInDays = Math.floor(diffInMs / msPerDay) + 1;

        const label = diffInDays === 1 ? "day" : "days";
        return `${diffInDays} ${label}`;
    }

    return (
        <View style={styles.inboxComponentContainer}>
            <Text style={styles.inboxComponentContainerText}>
                You have received a request for {request?.reason?.toLowerCase()} from{" "}
                <Text style={styles.inboxComponentContainerTextEmail}>
                    {user?.email || "loading..."}
                </Text>
            </Text>


            <View style={styles.inboxComponentContainerInfoContainer}>
                <View style={styles.inboxComponentContainerInfoContainerTitles}>
                    <Text style={styles.inboxComponentContainerInfoContainerTitle}>Start: </Text>

                    <Text style={styles.inboxComponentContainerInfoContainerTitle}>End: </Text>

                    <Text style={styles.inboxComponentContainerInfoContainerTitle}>Duration: </Text>
                </View>

                <View style={styles.inboxComponentContainerInfoContainerValues}>
                    <Text style={styles.inboxComponentContainerInfoContainerValue}>
                        {request?.startDate && `${request.startDate[0]}-${request.startDate[1]}-${request.startDate[2]}`}
                    </Text>

                    <Text style={styles.inboxComponentContainerInfoContainerValue}>
                        {request?.finishDate && `${request.finishDate[0]}-${request.finishDate[1]}-${request.finishDate[2]}`}
                    </Text>

                    <Text style={styles.inboxComponentContainerInfoContainerValue}>
                        {countDaysInclusiveWithLabel(request.startDate, request.finishDate)}
                    </Text>
                </View>
            </View>

            <View style={styles.inboxComponentContainerInfoContainerButtons}>
                <Pressable>
                    <Ionicons style={{color: "#53d628"}} name="checkmark-circle" size={35} />
                </Pressable>

                <Pressable>
                    <Ionicons style={{color: "#d62828"}} name="close-circle" size={35} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inboxComponentContainer: {
        padding: 15
    },
    inboxComponentContainerText: {
        fontSize: 15,
        fontWeight: 500,
        color: "#000"
    },
    inboxComponentContainerTextEmail: {
        ontSize: 15,
        fontWeight: 500,
        color: "#617DA6"
    },
    inboxComponentContainerInfoContainer: {
        flexDirection: "row",
        gap: 15,
        marginTop: 10
    },
    inboxComponentContainerInfoContainerTitles: {
        gap: 5
    },
    inboxComponentContainerInfoContainerTitle: {
        fontSize: 15,
        color: "#696969"
    },
    inboxComponentContainerInfoContainerValues: {
        gap: 5
    },
    inboxComponentContainerInfoContainerValue: {
        fontSize: 15,
        color: "#000"
    },
    inboxComponentContainerInfoContainerButtons: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15,
        gap: 20
    }
})