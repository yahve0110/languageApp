import Colors from '@/constants/Colors'
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'

interface ButtonProps {
    text: string
    onPress: () => void
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    disabled?: boolean
}

export default function Button({
    text,
    onPress,
    containerStyle,
    textStyle,
    disabled = false,
}: ButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                disabled && styles.disabledContainer,
                containerStyle,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.text,
                    disabled && styles.disabledText,
                    textStyle,
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.itemsColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    disabledContainer: {
        backgroundColor: '#385b94',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledText: {
        color: '#9E9E9E',
    },
})
