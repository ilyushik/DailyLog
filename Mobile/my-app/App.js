import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Main from "./pages/Main";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import Inbox from "./pages/Inbox";
import Team from "./pages/Team";
import {useEffect, useState} from "react";
import {axiosHelper} from "./axiosHelper";
import 'react-native-reanimated'

const Tab = createBottomTabNavigator();

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYW1hcmFsaWlseWFAZ21haWwuY29tIiwiaWF0IjoxNzUyOTEyNDc5LCJleHAiOjE3NTM1MTcyNzl9.2JFI_AN7co0cewEU12XL-fjj2K8SOaykeBEf1T4fSQU"

const leadToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbGxpYS5rYW1hcmFsaS53b3JrQGdtYWlsLmNvbSIsImlhdCI6MTc1MjkxMjQ0MiwiZXhwIjoxNzUzNTE3MjQyfQ.U0qCz7f7EZCgWAlPfjYGJ22tUU6d4qqnqqW13_GnrdA"

export default function App() {

  const [user, setUser] = useState({});
  const [requestsLeader, setRequestsLeader] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
      await axiosHelper("getMyInfo", leadToken, setUser);
      if (user.role !== "ROLE_USER") {
          await axiosHelper("requests/approver", leadToken, setRequestsLeader);
      }
    }
    fetchData();
  }, []);


  return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={Main}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ focused, size }) => (
                      <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color="#617DA6" />
                  ),
                  tabBarActiveTintColor: '#617DA6',
                  tabBarInactiveTintColor: '#999999',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                  },
                }}
            />
            {user.role !== "ROLE_USER" && (
                <Tab.Screen
                    name="Inbox"
                    component={Inbox}
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ focused, size }) => (
                          <Ionicons name={focused ? 'mail' : 'mail-outline'} size={size} color="#617DA6" />
                      ),
                      tabBarActiveTintColor: '#617DA6',
                      tabBarInactiveTintColor: '#999999',
                      tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                      },
                      tabBarBadge: requestsLeader.length > 0 ? requestsLeader.length : null,
                    }}
                />
            )}
            {user.role !== "ROLE_USER" && (
                <Tab.Screen
                    name="Team"
                    component={Team}
                    options={{
                      headerShown: false,
                      tabBarIcon: ({ focused, size }) => (
                          <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color="#617DA6" />
                      ),
                      tabBarActiveTintColor: '#617DA6',
                      tabBarInactiveTintColor: '#999999',
                      tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                      },
                    }}
                />
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  }
});


