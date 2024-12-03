import Colors from '@/constants/Colors'
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native'
import WebView from 'react-native-webview'
import { useState } from 'react'
import Loader from '@/components/shared/Loader'
import React from 'react'

const { width, height } = Dimensions.get('window')
const videoHeight = height * 0.75

const VideoLesson = ({ href }: { href: string }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [opacity] = useState(new Animated.Value(1))

    const hideLoader = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => setIsLoading(false))
    }

    return (
        <>
            <View style={styles.videoContainer}>
                {isLoading && (
                    <Animated.View
                        style={[styles.loaderContainer, { opacity }]}
                    >
                        <Loader color={Colors.light.green} />
                    </Animated.View>
                )}
                <WebView
                    style={[styles.video, isLoading && styles.hidden]}
                    source={{
                        uri: href,
                    }}
                    allowsFullscreenVideo
                    javaScriptEnabled
                    domStorageEnabled
                    scalesPageToFit
                    onLoadEnd={hideLoader}
                />
            </View>
        </>
    )
}

export default VideoLesson

const styles = StyleSheet.create({
    videoContainer: {
        height: '40%',
        width: '100%',
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        elevation: 5,
        padding: 5,
        paddingTop: 0,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    hidden: {
        opacity: 0,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        zIndex: 1,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
})
