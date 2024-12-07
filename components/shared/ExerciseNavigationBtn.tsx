import Colors from '@/constants/Colors'
import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

type Props = {
    onPress: () => void
    text: string
    disabled?: boolean
}

const ExerciseNavihationBtn = (props: Props) => {
    const { onPress, text, disabled = false } = props
    return (
        <TouchableOpacity 
            style={[
                styles.nextButton,
                disabled && styles.disabledButton
            ]} 
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[
                styles.nextText,
                disabled && styles.disabledText
            ]}>{text}</Text>
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
    disabledButton: {
        backgroundColor: Colors.light.itemsColor + '80',
        opacity: 0.6,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    nextText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '600',
    },
    disabledText: {
        color: Colors.light.text + '80',
    },
})
