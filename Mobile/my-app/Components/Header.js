import {Dimensions, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";

export default function Header() {

    const [mode, setMode] = useState('light')

    return (
        <View style={styles.header}>
            <Image style={styles.headerLogo} source={require('../assets/images/logo.png')}
                   resizeMode="contain" />

            <View style={styles.headerButtons}>
                <Pressable style={styles.button} onPress={() => {
                    if (mode === "light") {
                        setMode("dark");
                    } else {
                        setMode("light");
                    }
                    console.log(mode)
                }}>
                    <Ionicons name={mode === "light" ? "sunny-outline" : "moon-outline"} size={40}
                              color="#617DA6" />
                </Pressable>

                <Pressable onPress={() => {
                    console.log('Add request button pressed');
                }}><Text style={styles.addRequestHeader}>+ Add request</Text>
                </Pressable>
            </View>
        </View>
    )
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        backgroundColor: '#fff',
        height: windowHeight * 0.08,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerLogo: {
        position: 'relative',
        height: windowHeight * 0.06,
        width: windowWidth * 0.17,
        left: 0,
        top: 0,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    addRequestHeader: {
        backgroundColor: '#617DA6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        color: 'white',
        borderRadius: 10,
    }
});