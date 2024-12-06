import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
    audioUrl: string
    size?: number
}

export default function SoundButton({ audioUrl, size = 20 }: Props) {
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
        borderRadius: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
})
