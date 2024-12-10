import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Platform,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native'
import { useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { router } from 'expo-router'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

interface Level {
    id: number
    level: string
    available: boolean
}

export default function MainPage() {
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollViewRef = useRef<ScrollView>(null)
    const ITEM_WIDTH = Math.min(windowWidth * 0.7, 300)
    const ITEM_SPACING = 20

    const levels: Level[] = [
        { id: 1, level: 'A1', available: true },
        { id: 2, level: 'A2', available: false },
        { id: 3, level: 'B1', available: false },
        { id: 4, level: 'B2', available: false },
        { id: 5, level: 'C1', available: false },
    ]

    const scrollToIndex = (index: number) => {
        if (index >= 0 && index < levels.length) {
            scrollViewRef.current?.scrollTo({
                x: index * (ITEM_WIDTH + ITEM_SPACING),
                animated: true,
            })
            setActiveIndex(index)
        }
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x
        const index = Math.round(contentOffset / (ITEM_WIDTH + ITEM_SPACING))
        setActiveIndex(index)
    }

    const handleLevelPress = (level: Level) => {
        console.log('Level pressed:', level)
        if (level.available) {
            console.log('Navigating to:', `/level/${level.level.toLowerCase()}`)
            try {
                router.push({
                    pathname: '/levels/[id]',
                    params: { id: level.level.toLowerCase() },
                })
            } catch (error) {
                console.error('Navigation error:', error)
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose level</Text>
            <View style={styles.carouselWrapper}>
                <View style={styles.carouselContainer}>
                    <TouchableOpacity
                        style={[
                            styles.arrowButton,
                            styles.leftArrow,
                            { opacity: activeIndex === 0 ? 0.3 : 1 },
                        ]}
                        onPress={() => scrollToIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={30}
                            color={Colors.light.color}
                        />
                    </TouchableOpacity>

                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                        contentContainerStyle={[
                            styles.scrollContent,
                            { flexGrow: 1 },
                        ]}
                        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
                    >
                        {levels.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.levelButton,
                                    styles.elevation,
                                    item.available
                                        ? styles.available
                                        : styles.unavailable,
                                    {
                                        width: ITEM_WIDTH,
                                        marginRight: ITEM_SPACING,
                                        transform: [
                                            {
                                                scale:
                                                    activeIndex === index
                                                        ? 1
                                                        : 0.9,
                                            },
                                        ],
                                        opacity:
                                            activeIndex === index ? 1 : 0.6,
                                    },
                                ]}
                                onPress={() => handleLevelPress(item)}
                                disabled={!item.available}
                            >
                                <Text style={styles.levelText}>
                                    {item.level}
                                </Text>
                                {!item.available && (
                                    <View style={styles.comingSoonContainer}>
                                        <Text style={styles.comingSoonText}>
                                            Coming Soon
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.arrowButton,
                            styles.rightArrow,
                            {
                                opacity:
                                    activeIndex === levels.length - 1 ? 0.3 : 1,
                            },
                        ]}
                        onPress={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex === levels.length - 1}
                    >
                        <Ionicons
                            name="chevron-forward"
                            size={30}
                            color={Colors.light.color}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.indicators}>
                    {levels.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                {
                                    backgroundColor:
                                        activeIndex === index
                                            ? Colors.light.itemsColor
                                            : Colors.light.secondaryBackground,
                                    width: activeIndex === index ? 20 : 10,
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.light.color,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
    },
    carouselWrapper: {
        height: windowHeight * 0.7,
        justifyContent: 'center',
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: windowHeight * 0.6,
    },
    scrollContent: {
        paddingHorizontal:
            (Dimensions.get('window').width -
                Dimensions.get('window').width * 0.7) /
            2,
        alignItems: 'center',
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.secondaryBackground,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {},
        }),
    },
    leftArrow: {
        left: 10,
    },
    rightArrow: {
        right: 10,
    },
    levelButton: {
        height: windowHeight * 0.6,
        backgroundColor: Colors.light.secondaryBackground,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    levelText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.light.color,
        marginBottom: 10,
    },
    elevation: {
        elevation: Platform.OS === 'android' ? 2 : 0,
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        height: 20,
    },
    indicator: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    comingSoonContainer: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    comingSoonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    available: {
        backgroundColor: Colors.light.itemsColor,
    },
    unavailable: {
        backgroundColor: Colors.light.secondaryBackground,
    },
})
