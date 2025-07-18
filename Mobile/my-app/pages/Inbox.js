import Layout from "../Components/Layout";
import {StyleSheet, Text, View} from "react-native";

export default function Inbox() {
    return (
        <Layout>
            <View style={styles.inboxContainer}>
                <Text>Inbox</Text>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    inboxContainer: {
        backgroundColor: '#e3e3e3',
    },
});