import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface LessonListItemProps {
    title: string
    number: number
    available: boolean
    id: string
}

export default function LessonListItem({
    title,
    number,
    available,
    id,
}: LessonListItemProps) {
    const handlePress = () => {
        if (available) {
            router.push({
                pathname: '/lesson/[id]',
                params: {
                    id,
                    title,
                },
            })
        }
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={available ? 0.7 : 1}
            disabled={!available}
        >
            <View style={[styles.content]}>
                <View
                    style={[
                        styles.levelIndicator,
                        available
                            ? styles.availableBorder
                            : styles.unavailableBorder,
                    ]}
                >
                    <Text style={[styles.indicatorText]}>{number}</Text>
                </View>
                <Text
                    style={styles.levelTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={available ? Colors.light.color : '#666'}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        backgroundColor: Colors.light.itemsColor,
        justifyContent: 'space-between',
        borderWidth: 3,
        minHeight: 120,
    },
    availableBorder: {
        borderColor: Colors.light.green,
    },
    unavailableBorder: {
        borderColor: Colors.light.red,
        opacity: 0.7,
    },
    levelIndicator: {
        width: 45,
        height: 45,
        borderWidth: 4,
        borderColor: Colors.light.green,
        backgroundColor: '#fff',
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    levelTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.color,
        marginHorizontal: 20,
    },
})
