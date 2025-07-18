import Layout from "../Components/Layout";
import {StyleSheet, Text, View} from "react-native";

export default function Team() {
    return (
        <Layout>
            <View style={styles.teamContainer}>
                <Text>Team</Text>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    teamContainer: {
        backgroundColor: '#e3e3e3',
    },
});