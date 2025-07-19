import Layout from "../Components/Layout";
import {Dimensions, FlatList, StyleSheet, Text, View} from "react-native";
import React, {useState, useEffect} from "react";
import InboxComponent from "./InboxComponents/InboxComponent";
import axios from "axios";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1hcmFsaWlseWFAZ21haWwuY29tIiwiaWF0IjoxNzUyOTEyNDc5LCJleHAiOjE3NTM1MTcyNzl9.2JFI_AN7co0cewEU12XL-fjj2K8SOaykeBEf1T4fSQU"

const leadToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbGxpYS5rYW1hcmFsaS53b3JrQGdtYWlsLmNvbSIsImlhdCI6MTc1MjkxMjQ0MiwiZXhwIjoxNzUzNTE3MjQyfQ.U0qCz7f7EZCgWAlPfjYGJ22tUU6d4qqnqqW13_GnrdA"

export default function Inbox() {

    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/requests/approver`, {
                headers: {
                    Authorization: `Bearer ${leadToken}`,
                }
            });
            console.log(response.data);
            setRequests(response.data);
        } catch (e) {
            console.log("Ошибка при получении запроса Request Component:", e?.response?.data || e.message);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);      // Показать индикатор
        await fetchData();        // Загрузить данные
        setRefreshing(false);     // Скрыть индикатор
    };

    useEffect(() => {
        fetchData();
    }, []);


    const renderSeparator = () => (
        <View style={styles.separator} />
    );

    return (
        <Layout>
            <View style={styles.inboxContainer}>
                <View style={styles.inboxContainerBlock}>
                    <View style={styles.inboxContainerBlockHeader}>
                        <Text style={styles.inboxContainerBlockHeaderText}>Inbox</Text>
                    </View>

                    <View style={styles.inboxContainerBlockData}>
                        {requests.length < 1 ? (<Text style={styles.inboxContainerBlockDataEmpty}>No requests</Text>) : (
                            <FlatList data={requests} renderItem={({ item }) => (
                                <InboxComponent requestId={item.id} />
                            )} ItemSeparatorComponent={renderSeparator} refreshing={refreshing}
                            onRefresh={onRefresh} />
                        )}
                    </View>
                </View>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    inboxContainer: {
        backgroundColor: '#e3e3e3',
    },
    inboxContainerBlock: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: -screenHeight * 0.06
    },
    inboxContainerBlockHeader: {
        backgroundColor: '#617DA6',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
    },
    inboxContainerBlockHeaderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 500,
    },
    inboxContainerBlockData: {
        maxHeight: screenHeight * 0.5,
    },
    inboxContainerBlockDataEmpty: {
        color: '#000',
        fontSize: 18,
        fontWeight: 500,
        padding: 15
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    }
});