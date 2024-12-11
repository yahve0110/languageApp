import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Translator from '@/components/pages/translatorPage/Translator';
import Folders from '@/components/pages/foldersPage/Folders';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function FlashcardsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const translateX = useState(new Animated.Value(0))[0];
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / 3;

  useEffect(() => {
    if (isTrainingMode) {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }
      });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    }
  }, [isTrainingMode, navigation]);

  const switchTab = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * (screenWidth / 2) + (screenWidth / 4 - tabWidth / 2),
      useNativeDriver: true,
      tension: 68,
      friction: 10
    }).start();
    setActiveTab(index);
  };

  useEffect(() => {
    // Initial indicator position
    translateX.setValue(screenWidth / 4 - tabWidth / 2);
  }, []);

  return (
    <View style={styles.container}>
      {!isTrainingMode && (
        <View style={styles.tabBar}>
          <Animated.View 
            style={[
              styles.indicator, 
              {
                transform: [{ translateX }],
                width: tabWidth,
              }
            ]} 
          />
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab(0)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 0 && styles.activeTabText
            ]}>Folders</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => switchTab(1)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              activeTab === 1 && styles.activeTabText
            ]}>Translator</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {activeTab === 0 ? (
          <Folders onTrainingModeChange={setIsTrainingMode} isTrainingMode={isTrainingMode} />
        ) : (
          <Translator />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondaryBackground,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    backgroundColor: Colors.light.secondaryBackground,
    paddingVertical: 15,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  tabText: {
    color: '#b0bec5',
    fontSize: 18,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
});