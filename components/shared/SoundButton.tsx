import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

interface Props {
    audioUrl: string
    size?: number
    hide?: boolean
    large?: boolean
    autoPlay?: boolean
    onPlayingStateChange?: (isPlaying: boolean) => void
}

export default function SoundButton({
    audioUrl,
    size = 40,
    hide = false,
    autoPlay = false,
    onPlayingStateChange
}: Props) {
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const playSoundAutomatically = async () => {
        try {
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

            await playSoundAutomatically()
        } catch (error) {
            console.error('Ошибка воспроизведения:', error)
            setIsPlaying(false)
            onPlayingStateChange?.(false)
        }
    }

    useEffect(() => {
        // Automatically play sound if autoPlay is true
        if (autoPlay) {
            playSoundAutomatically()
        }

        // Cleanup function
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [audioUrl, autoPlay])

    // If hide is true, return null (render nothing)
    if (hide) {
        return null
    }

    return (
        <TouchableOpacity
            style={[
                styles.soundButton,
                {
                    width: size,
                    height: size,
                }
            ]}
            onPress={handleSoundPress}
        >
            <FontAwesome
                name={isPlaying ? "stop" : "volume-up"}
                size={size * 0.6}
                color={Colors.light.text}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    soundButton: {
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
})