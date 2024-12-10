import { StyleSheet, View } from 'react-native'
import MainPage from '@/components/pages/MainPage/MainPage'

export default function LessonsScreen() {
    return (
        <View style={styles.container}>
            <MainPage />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
