import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Animated,BackHandler, StyleSheet, Text, Linking, TouchableOpacity, View, ActivityIndicator, PanResponder , ScrollView} from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';
export const LastVisitedUrlContext = React.createContext();
export const reloadWebViewIfConnected = async (webViewRef) => {
  const netInfoState = await NetInfo.fetch();
  if (netInfoState.isConnected) {
    webViewRef.current.reload();
  }
};
export default function HomeScreen() {
  const webViewRef = useRef(null)
  const [offline, setOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshAnimation] = useState(new Animated.Value(0));
  const [canGoBack, setCanGoBack] = useState(false);
  const [panResponder, setPanResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (event, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderRelease: async (event, gestureState) => {
        if (gestureState.dy > 60) {
          await triggerRefresh();
      
        }
      },
    })
  );
  const triggerRefresh = async () => {
    setIsRefreshing(true); 
    setTimeout(() => {
      setIsRefreshing(false); 
    }, 6000);
    NetInfo.fetch().then((state) => {
      setOffline(!state.isConnected);
      webViewRef.current.reload();
     
    });
  };
  const [lastVisitedUrl, setLastVisitedUrl] = useState(null);

  useEffect(() => {
    // Load the last visited URL from AsyncStorage when the component mounts
    const loadLastVisitedUrl = async () => {
      try {
        const url = await AsyncStorage.getItem('lastVisitedUrl');
        if (url !== null) {
          setLastVisitedUrl(url);
        }
      } catch (e) {
        console.log('Error loading last visited URL:', e);
      }
    };
    loadLastVisitedUrl();
  }, []);

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
      setIsRefreshing(false);
      refreshAnimation.setValue(0);
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
   setIsRefreshing(false)
   hideLoader(true)
  }
  const handleExternalLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Check if the URL is for a social media platform
      if (
        url.includes('twitter.com') ||
        url.includes('facebook.com') ||
        url.includes('instagram.com')
        // Add more social media platforms here
      ) {
        await Linking.openURL(url); // Open the social media app
      } else {
        // Load the URL in the WebView for other links
        webViewRef.current.injectJavaScript(`window.location.href = '${url}'`);
      }
    } else {
      // Load the URL in the WebView if not supported
      webViewRef.current.injectJavaScript(`window.location.href = '${url}'`);
    }
  };
 return (
 
   
   <ScrollView contentContainerStyle={styles.scrollViewContent} {...panResponder.panHandlers}>
  
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
          <LastVisitedUrlContext.Provider value={lastVisitedUrl} >
          {isLoading && <ActivityIndicator style={styles.loadingContainer} size="large" color="#00FF00" animating={true}/>}
          <WebView
          style={{ flex: 1}}
            source={{  uri: lastVisitedUrl || 'https://www.tuwizedata.com/' }}
            ref={webViewRef}
            originWhitelist={['*']}
            onError={() => setOffline(true)} 
            onLoadStart={() => setIsRefreshing(true)}
            onLoadEnd={end}
            cacheEnabled={true}
            cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            onNavigationStateChange={onNavigationStateChange}
            userAgent={'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url;
              
              if (!url.startsWith('https://www.tuwizedata.com/')) {
              
                Linking.openURL(url);
              }
              return true; 
            }}
          />
         
          </LastVisitedUrlContext.Provider>
          {isRefreshing && (
            <View style={styles.refreshContainer}>
              <RefreshControl size="default" color="#2a0a2b" onRefresh={null} />
            </View>
          )}
          </View>
         
      )}
     
     
      </ScrollView>
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
  backgroundColor: '#2a0a2b' ,   borderRadius: 5,
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
  },
  refreshContainer: {
    position: 'absolute',
    top: 20,
    left: 160,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    zIndex:9999999
  },
  scrollViewContent:{
  marginTop:4,
    flexGrow:1
  }
});
const iconStyle = {
  color: '#fff',
  fontWeight: 'bold',
};