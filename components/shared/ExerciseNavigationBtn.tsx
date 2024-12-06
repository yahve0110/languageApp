import Colors from '@/constants/Colors'
import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

type Props = {
    onPress: () => void
    text: string
}

const ExerciseNavihationBtn = (props: Props) => {
    const { onPress, text } = props
    return (
        <TouchableOpacity style={styles.nextButton} onPress={onPress}>
            <Text style={styles.nextText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default ExerciseNavihationBtn

const styles = StyleSheet.create({
    nextButton: {
        alignSelf: 'flex-end',
        padding: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: Colors.light.itemsColor,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nextText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '600',
    },
})
