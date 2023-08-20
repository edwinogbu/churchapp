
import React, { useContext, useState, useEffect } from 'react';
import { View, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { colors } from './Colors';
import { auth,  } from './../../firebase'; // Import your Firebase Firestore instance
// import { collection, doc, getDoc } from 'firebase/firestore';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './../AuthContext';


const DrawerContent = (props) => {
  const { state: { user }, signOut } = useContext(AuthContext);
// console.log(user.email);
  const userId = user.uid;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [setUser] = useState(null); // State to store the user details
  const [userDetails, setUserDetails] = useState(null); // State to store the user details

  // useEffect(() => {
  //   // Fetch the user details from Firestore
  //   const fetchUserDetails = async () => {
  //     try {
  //       // Make a query to fetch the user document based on the user's UID
  //       const userDocRef = doc(auth, 'users', user.uid);
  //       const userDocSnap = await getDoc(userDocRef);

  //       if (userDocSnap.exists()) {
  //         const userData = userDocSnap.data(); // Extract the user data from the document

  //         // Update the user state with the fetched user details
  //         setUser(userData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //     }
  //   };
    
    
  //   if (user) {
  //     fetchUserDetails(); // Call the function to fetch user details when the user state is set
  //   }
  // }, [user]);

  useEffect(() => {
    // Fetch the user details from Firestore
    const fetchUserDetails = async () => {
      try {
        // Make a query to fetch the user document based on the user's UID
        const userDocRef = doc(collection(getFirestore(), 'users'), user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data().userDetails; // Extract the userDetails object from the document
          // console.log(userData);
          // console.log(userData.phone);
          // Update the user state with the fetched user details
          setUserDetails(userData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (user) {
      fetchUserDetails(); // Call the function to fetch user details when the user state is set
    }
  }, [user]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = () => {
    signOut();
  };


  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? colors.dark : colors.white,
        color: isDarkMode ? colors.white : colors.grey1,
      }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors.dark : colors.primary,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDarkMode ? colors.dark : colors.primary,
              paddingLeft: 20,
              paddingVertical: 10,
            }}>
            <Avatar
              rounded
              avatarStyle={{
                ...styles.avatar,
                borderColor: colors.white,
              }}
              size={75}
              source={require('../../assets/images/envoys.jpg')}
            />
              {userDetails && (
            <View style={{ marginLeft: 10, }}>
            
              <Text style={{
                  color: isDarkMode ||  colors.dark ? colors.primary: colors.cardbackground,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Mr {user && user.name || user.displayName || userDetails.name} 
                
              </Text>
              <Text
                style={{...styles.text,
                  color: isDarkMode ||  colors.dark ? colors.primary: colors.cardbackground,
                  fontSize: 9,
                }}>
                {user && user.email || userDetails.email}
              </Text>
            </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              paddingBottom: 5,
            }}>
            <View style={{ flexDirection: 'row', marginLeft: 0 }}>
              <View
                style={{
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.cardbackground,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    <FontAwesome5
                      type="material-community"
                      name="user"
                      size={35}
                      color={isDarkMode || colors.dark ?colors.primary: colors.cardbackground}
                      onPress={() => {
                        props.navigation.navigate('ProfileScreen');
                      }}
                    />
                </Text>
                <Text
                  style={{
                    color: isDarkMode || colors.dark ?colors.primary: colors.cardbackground,
                    fontSize: 14,
                  }}>
                   News/Event
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 0 }}>
              <View
                style={{
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.cardbackground,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  <View
                    style={{
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5
                      type="material-community"
                      name="handshake"
                      size={35}
                      color={isDarkMode || colors.dark ?colors.primary: colors.cardbackground}
                      onPress={() => {
                        props.navigation.navigate('ProfileScreen');
                      }}
                    />
                  </View>
                </Text>
                <Text
                  style={{
                    color: isDarkMode ||  colors.dark ? colors.primary: colors.cardbackground,
                    fontSize: 14,
                    }}>Profile</Text>
              </View>
              </View>
              </View>

      <View
        style={{
          backgroundColor: isDarkMode ? colors.dark : colors.white,
          marginTop: 10,
        }}>
      
      </View>
    </View>

    <View style={{ marginTop: 10 }}>

    <DrawerItemList {...props} />

     

      <DrawerItem
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="theme-light-dark" color={color} size={size} />
        )}
        label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        onPress={toggleDarkMode}
        labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
        switch={
          <Switch
            trackColor={{ false: colors.light, true: colors.grey }}
            thumbColor={isDarkMode ? colors.grey : colors.white}
            ios_backgroundColor={colors.light}
            value={isDarkMode}
            onValueChange={toggleDarkMode}
          />
        }
      />

      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons name="log-out" color={color} size={size} />
        )}
        label="Sign Out"
        onPress={handleSignOut}
        labelStyle={{ color: isDarkMode ? colors.white : colors.black }}
      />
    </View>
  </DrawerContentScrollView>
</View>
);
};

export default DrawerContent;



const styles = StyleSheet.create({
    container:{
        flex:1
    },
    avatar:{
        borderWidth:4,
        borderColor:colors.pagebackground,
       
    },

    preferences:{
       fontSize:14,
       color:colors.grey2,
       paddingTop:10,
        paddingLeft:20,
        
    },

    switchText:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingLeft:20,
        paddingVertical:5,
        paddingRight:10
    },
    darkthemeText:{
        fontSize:14,
        color:colors.grey,
        paddingTop:10,
         paddingLeft:20,
         fontWeight:'bold'
    },
    text:{
      color:'#fff'
    }
})
