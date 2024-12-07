import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
    audioUrl: string
    size?: number
    onPlayingStateChange?: (isPlaying: boolean) => void
}

export default function SoundButton({ audioUrl, size = 20, onPlayingStateChange }: Props) {
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handleSoundPress = async () => {
        try {
            if (isPlaying) {
                if (sound) {
                    await sound.stopAsync()
                    setIsPlaying(false)
                    onPlayingStateChange?.(false)
                }
                return
            }

            const { sound: newSound } = await Audio.Sound.createAsync({
                uri: audioUrl,
            })
            
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (!status.isPlaying && status.didJustFinish) {
                        setIsPlaying(false)
                        onPlayingStateChange?.(false)
                    }
                }
            })

            await newSound.playAsync()
            setIsPlaying(true)
            onPlayingStateChange?.(true)

            if (sound) {
                await sound.unloadAsync()
            }
            setSound(newSound)
        } catch (error) {
            console.error('Ошибка воспроизведения:', error)
            setIsPlaying(false)
            onPlayingStateChange?.(false)
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
                name={isPlaying ? "stop" : "volume-up"}
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
