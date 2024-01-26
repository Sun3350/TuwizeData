import React, { useRef, useState, useEffect} from 'react';
import {BackHandler, StyleSheet, Text,TouchableOpacity, View, ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const reloadWebViewIfConnected = async (webViewRef) => {
  const netInfoState = await NetInfo.fetch();
  if (netInfoState.isConnected) {
    webViewRef.current.reload();
  }
};
export default function Vendor() {
  const webViewRef = useRef(null)
  const [offline, setOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const handleNavigationStateChange = (navState) => {
    if (navState && navState.url) { 
      setLastVisitedUrl(navState.url);
      try {
        AsyncStorage.setItem('lastVisitedUrl', navState.url);
      } catch (e) {
        console.log('Error saving last visited URL:', e);
      }
    }
  };
    const hideLoader = () => {
      setIsLoading(false);
     
    };
  ////OFFLINE
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setOffline(!state.isConnected);
    });
  }, []);
/////BACK BUTTON....
  const onNavigationStateChange = async (navState) => {
    handleNavigationStateChange()
     setCanGoBack(navState.canGoBack);
  };
useEffect(() => {
  const handleBackButton = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
   };
 
   BackHandler.addEventListener('hardwareBackPress', handleBackButton);
 
   return () => {
     BackHandler.removeEventListener(
       'hardwareBackPress',
       handleBackButton
     );
   };
 }, [canGoBack]);
  const end = () => {
   hideLoader(true)
  }
 
 return (  
   <View style={{flex: 1, marginTop:10}} >
     {offline ? (
       <View  style={styles.offlineContainer} >
         <Ionicons
           style={styles.offline}
           name="cloud-offline-outline"
        size={100}
      />
      <Text style={styles.appButtonText}>
        Sorry, no internet connection.
         </Text>
         <TouchableOpacity style={styles.button}
         onPress={() => {
             NetInfo.fetch().then((state) => {
               setOffline(!state.isConnected);
               webViewRef.current.reload();
             });
            }}>
      <Text style={styles.buttonText}>Retry</Text>
    </TouchableOpacity>
        </View>
      ) : (
        <View   style={{ flex: 1}}> 
          {isLoading && <ActivityIndicator style={styles.loadingContainer} size="large" color="#008000" animating={true}/>}
          <WebView
          style={{ flex: 1}}
          source={{ uri: 'https://www.tuwizedata.com/' }}
            ref={webViewRef}
            originWhitelist={['*']}
            onError={() => setOffline(true)} 
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={end}
            cacheEnabled={true}
            cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={onNavigationStateChange}
            userAgent={'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
          />
          </View>
      )}
      </View>
 );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flexGrow:1
  },
 offlineContainer:{
   flex:1,
  justifyContent: 'center',
  alignItems: 'center',
 },
 appButtonText: {
    color: '#2a0a2b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
 button:  {height: 40,
  width: 100,
  backgroundColor: 'blue',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#008000' ,   borderRadius: 5,
  marginTop: 2,
},
buttonText: {
  color: '#FFFFFF',
  fontSize: 18,
  textAlign: 'center',
},
  offline: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
},
 loadingContainer: {
   position: 'absolute',    
   top: 0,    
   bottom: 0,    
   left: 0,    
   right: 0,
   zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});
