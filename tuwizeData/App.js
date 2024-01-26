import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FirstPage from './Components/FirstPage'
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
     <FirstPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
