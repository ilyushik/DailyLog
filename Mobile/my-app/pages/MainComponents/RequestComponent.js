import {View, StyleSheet, Text} from "react-native";
import React, {useState, useEffect,} from "react";
import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1hcmFsaWlseWFAZ21haWwuY29tIiwiaWF0IjoxNzUyOTEyNDc5LCJleHAiOjE3NTM1MTcyNzl9.2JFI_AN7co0cewEU12XL-fjj2K8SOaykeBEf1T4fSQU"

const leadToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbGxpYS5rYW1hcmFsaS53b3JrQGdtYWlsLmNvbSIsImlhdCI6MTc1MjkxMjQ0MiwiZXhwIjoxNzUzNTE3MjQyfQ.U0qCz7f7EZCgWAlPfjYGJ22tUU6d4qqnqqW13_GnrdA"

export default function RequestComponent(props) {
    const [request, setRequest] = useState({});
    const [email, setEmail] = useState("");

    useEffect(() => {
        // await axiosHelper(`requests/request/${props.requestId}`, token, setRequest)
        const fetchData = async () => {
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
                console.log("Ошибка при получении запроса Request Component:", e?.response?.data || e.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setEmail(props.email);
    }, [props.email]);

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

    function requestStatus(status) {
        if (status === "Declined") {
            return (<Text style={styles.requestComponentStatusDeclined}>Declined</Text>)
        } else if (status === "Approved") {
            return (<Text style={styles.requestComponentStatusApproved}>Approved</Text>)
        } else if (status === "Pending") {
            return (<Text style={styles.requestComponentStatusPending}>Pending</Text>)
        }
    }


    return (
        <View style={styles.requestComponentContainer}>
            <Text style={styles.requestComponentContainerText}>{request?.reason}</Text>

            <View style={styles.requestComponentContainerInfoContainer}>
                <View style={styles.requestComponentContainerInfoContainerTitles}>
                    <Text style={styles.requestComponentContainerInfoContainerTitle}>Start: </Text>

                    <Text style={styles.requestComponentContainerInfoContainerTitle}>End: </Text>

                    <Text style={styles.requestComponentContainerInfoContainerTitle}>Duration: </Text>

                    <Text style={styles.requestComponentContainerInfoContainerTitle}>Status: </Text>
                </View>

                <View style={styles.requestComponentContainerInfoContainerValues}>
                    <Text style={styles.requestComponentContainerInfoContainerValue}>
                        {request?.startDate && `${request.startDate[0]}-${request.startDate[1]}-${request.startDate[2]}`}
                    </Text>

                    <Text style={styles.requestComponentContainerInfoContainerValue}>
                        {request?.finishDate && `${request.finishDate[0]}-${request.finishDate[1]}-${request.finishDate[2]}`}
                    </Text>

                    <Text style={styles.requestComponentContainerInfoContainerValue}>
                        {countDaysInclusiveWithLabel(request?.startDate, request?.finishDate)}
                    </Text>

                    <Text style={styles.requestComponentContainerInfoContainerValue}>
                        {requestStatus(request?.status)}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    requestComponentContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    requestComponentContainerText: {
        fontSize: 15,
        fontWeight: 500
    },
    requestComponentContainerTextEmail: {
        color: "#617DA6"
    },
    requestComponentContainerInfoContainer: {
        marginTop: 10,
        flexDirection: "row",
        gap: 20
    },
    requestComponentContainerInfoContainerTitles: {
        gap: 10
    },
    requestComponentContainerInfoContainerTitle: {
        color: "#696969"
    },
    requestComponentContainerInfoContainerValues: {
        gap: 10
    },
    requestComponentContainerInfoContainerValue: {},
    requestComponentStatusDeclined: {
        color: "red"
    },
    requestComponentStatusApproved: {
        color: "#69cf16"
    },
    requestComponentStatusPending: {
        color: "yellow"
    },
})