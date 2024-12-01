import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

// TabBarIcon component to render icons with dynamic color
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    // Dynamically change the StatusBar color based on the selected tab
    React.useEffect(() => {
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.light.secondaryBackground);
        }
    }, []);

    return (
        <>
            <StatusBar
                backgroundColor={Colors.light.secondaryBackground}
                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarActiveTintColor: Colors.light.itemsColor,
                        tabBarInactiveTintColor: Colors.light.color,
                        tabBarStyle: {
                            backgroundColor: Colors.light.secondaryBackground,
                            borderTopWidth: 1,
                            borderTopColor: "#ffffff",
                            shadowColor: "#ffffff",
                            shadowOffset: {
                                width: 0,
                                height: -2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 5,
                            height: 100,
                            paddingBottom: 10,
                        },
                        tabBarShowLabel: false,
                        tabBarHideOnKeyboard: true,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
                        }}
                    />

                    <Tabs.Screen
                        name="profile"
                        options={{
                            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                        }}
                    />

                    <Tabs.Screen
                        name="settings"
                        options={{
                            tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="chat"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon name="comments" color={color} />
                            ),
                        }}
                    />
                </Tabs>
            </SafeAreaView>
        </>
    );
}
