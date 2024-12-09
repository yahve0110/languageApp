import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Translator from '@/components/translator/Translator';
import Folders from '@/components/foldersPage/Folders';
import Colors from '@/constants/Colors';

const Tab = createMaterialTopTabNavigator();

export default function FlashcardsScreen() {
  return (
    <Tab.Navigator   screenOptions={{
      tabBarStyle: { backgroundColor: Colors.light.secondaryBackground }, 
      tabBarIndicatorStyle: { backgroundColor: '#ffffff' },
      tabBarLabelStyle: { fontSize: 14 }, 
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#b0bec5', 
    }}
  >
      <Tab.Screen name="Folders" component={Folders} />
      <Tab.Screen name="Translator" component={Translator} />
    </Tab.Navigator>
  );
}
 