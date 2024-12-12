import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    style?: ViewStyle;
}

const { height } = Dimensions.get('window');

const CustomModal: React.FC<Props> = ({ isVisible, onClose, title, children, style }) => {
    if (!isVisible) return null;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity 
                style={styles.backdrop} 
                onPress={onClose} 
                activeOpacity={1}
            />
            <View style={[styles.modalContainer, style]}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '100%',
        position: 'relative',
        zIndex: 1001,
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: height * 0.3,
        maxHeight: height * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    modalCloseButton: {
        padding: 5,
    },
});

export default CustomModal;
