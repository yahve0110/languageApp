import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import Colors from '@/constants/Colors'

interface Props {
    audioUrl: string
    size?: number
}

export default function SoundButton({ audioUrl, size = 32 }: Props) {
    const [sound, setSound] = useState<Audio.Sound | null>(null)

    const handleSoundPress = async () => {
        try {
            const { sound: newSound } = await Audio.Sound.createAsync({
                uri: audioUrl,
            })
            await newSound.playAsync()

            if (sound) {
                await sound.unloadAsync()
            }
            setSound(newSound)
        } catch (error) {
            console.error('Ошибка воспроизведения:', error)
        }
    }

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [sound])

    return (
        <TouchableOpacity style={styles.soundButton} onPress={handleSoundPress}>
            <FontAwesome
                name="volume-up"
                size={size}
                color={Colors.light.text}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    soundButton: {
        padding: 10,
        borderRadius: 10,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.itemsColor,
    },
})
