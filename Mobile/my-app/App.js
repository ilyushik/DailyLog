import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Main from "./pages/Main";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import Inbox from "./pages/Inbox";
import Team from "./pages/Team";

const Tab = createBottomTabNavigator();

const inboxCount = 3

const role = "admin"

export default function App() {

  return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Main} options={{
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
            }}/>

            {role === "admin" && <Tab.Screen name="Inbox" component={Inbox} options={{
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
              tabBarBadge: inboxCount > 0 ? inboxCount : null,
            }}/>}

            {role === "admin" && <Tab.Screen name="Team" component={Team} options={{
              headerShown: false,
              tabBarIcon: ({ focused, size }) => (
                  <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color="#617DA6"/>
              ),
              tabBarActiveTintColor: '#617DA6',
              tabBarInactiveTintColor: '#999999',
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
              },
            }}/>}
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


