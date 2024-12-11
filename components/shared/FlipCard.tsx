import React from 'react';
import {
    Dimensions,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = height * 0.6;

interface FlipCardProps {
    frontContent: {
        imageUrl?: string;
        text: string;
    };
    backContent: {
        text: string;
        description?: string;
    };
    width?: number;
    height?: number;
}

const FlipCard: React.FC<FlipCardProps> = ({
    frontContent,
    backContent,
    width = ITEM_WIDTH,
    height = ITEM_HEIGHT,
}) => {
    const [flipped, setFlipped] = React.useState(false);
    const rotation = useSharedValue(0);

    const flipCard = () => {
        if (flipped) {
            rotation.value = withTiming(0, { duration: 500 });
        } else {
            rotation.value = withTiming(180, { duration: 500 });
        }
        setFlipped(!flipped);
    };

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value}deg` }],
        opacity: rotation.value < 90 ? 1 : 0,
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value - 180}deg` }],
        opacity: rotation.value >= 90 ? 1 : 0,
    }));

    return (
        <TouchableWithoutFeedback onPress={flipCard}>
            <View style={[styles.cardsContainer, { width, height }]}>
                {/* Front Side */}
                <Animated.View style={[styles.card, frontAnimatedStyle]}>
                    {frontContent.imageUrl && (
                        <Image
                            source={{ uri: frontContent.imageUrl }}
                            style={styles.image}
                            onError={(error) =>
                                console.error('Error loading image:', error)
                            }
                        />
                    )}
                    <Text style={styles.word}>{frontContent.text}</Text>
                </Animated.View>

                {/* Back Side */}
                <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
                    <Text style={styles.word}>{backContent.text}</Text>
                    {backContent.description && (
                        <>
                            <View style={styles.divider} />
                            <Text style={styles.description}>{backContent.description}</Text>
                        </>
                    )}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    cardsContainer: {
        alignSelf: 'center',
        perspective: '1000px',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.light.cardsBackground,
        backfaceVisibility: 'hidden',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'gray',
        padding: 20,
    },
    backCard: {
        backgroundColor: Colors.light.cardsBackground,
        transform: [{ rotateY: '180deg' }],
        justifyContent: 'center',
    },
    image: {
        width: 220,
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 10,
    },
    word: {
        fontSize: 24,
        color: Colors.light.text,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        marginTop: 10,
    },
    divider: {
        width: '80%',
        height: 1,
        backgroundColor: Colors.light.text,
        opacity: 0.2,
        marginVertical: 10,
    },
});

export default FlipCard;
