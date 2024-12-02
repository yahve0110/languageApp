import { View, StyleSheet, StatusBar, FlatList, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import Colors from '@/constants/Colors'

interface Lesson {
    id: string
    title: string
    number: number
    available: boolean
}

export default function LevelScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()

    const lessonsEn: Lesson[] = [
        {
            id: 'c807e076-8ee0-46ee-a2e7-ed5b87dffca0',
            title: 'Tervitused ja hüvastijätud (Greetings and Farewells)',
            number: 1,
            available: true,
        },
        {
            id: '2',
            title: 'Põhiväljendid (Basic Expressions)',
            number: 2,
            available: false,
        },
        {
            id: '3',
            title: 'Numbrid 1-20 (Numbers 1-20)',
            number: 3,
            available: false,
        },
        { id: '4', title: 'Tähestik (Alphabet)', number: 4, available: false },
        { id: '5', title: 'Värvid (Colors)', number: 5, available: false },
        { id: '6', title: 'Perekond (Family)', number: 6, available: false },
        {
            id: '7',
            title: 'Nädalapäevad ja kuud (Days and Months)',
            number: 7,
            available: false,
        },
        {
            id: '8',
            title: 'Mina ja minu sõbrad (Me and My Friends)',
            number: 8,
            available: false,
        },
        {
            id: '9',
            title: 'Kodu ja mööbel (Home and Furniture)',
            number: 9,
            available: false,
        },
        {
            id: '10',
            title: 'Toit ja jook (Food and Drinks)',
            number: 10,
            available: false,
        },
        { id: '11', title: 'Riided (Clothes)', number: 11, available: false },
        {
            id: '12',
            title: 'Ilm ja aastaajad (Weather and Seasons)',
            number: 12,
            available: false,
        },
        {
            id: '13',
            title: 'Kehaosad (Body Parts)',
            number: 13,
            available: false,
        },
        {
            id: '14',
            title: 'Igapäevased tegevused (Daily Activities)',
            number: 14,
            available: false,
        },
        {
            id: '15',
            title: 'Transpordivahendid (Transport)',
            number: 15,
            available: false,
        },
    ]

    return (
        <View style={styles.container}>
            <Text style={{ coor: 'red' }}>{id}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    listContent: {
        padding: 20,
    },
    separator: {
        height: 10,
    },
})
