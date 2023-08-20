import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity,Image, ImageBackground, ScrollView , Alert} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Entypo, MaterialCommunityIcons,MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import DrawerContent from './../components/DrawerContent';
import PaymentScreen from './../PaymentScreen';
import ExpenseDetailScreen from './../ExpenseDetailScreen';
import ChurchAttendanceScreen from './../ChurchAttendanceScreen';
import TransactionScreen from './../TransactionScreen';
import Home from './../Home';
import ProfileScreen from './../ProfileScreen';
import NewMemberDetailScreen from '../NewMemberDetailScreen';
import UserListScreen from './../UserListScreen';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Ionicons name={iconName} size={40} color={focused ? '#00048D' : '#808080'} />;
          }else if (route.name === 'Profile') {
            iconName = 'account';
            return <MaterialCommunityIcons name={iconName} size={40} color={focused ? '#00048D' : '#808080'} />;
          
        
          }else if (route.name === 'ChurchAttendance') {
            iconName = 'church';
            return <FontAwesome5 name={iconName} size={40} color={focused ? '#00048D' : '#808080'} />;
          
          }else if (route.name === 'Payment') {
            iconName = 'update';
            return <MaterialIcons name={iconName} size={40} color={focused ? '#00048D' : '#808080'} />;
          
          
          }else if (route.name === 'Transaction') {
            iconName = 'payments';
            return <MaterialIcons name={iconName} size={40} color={focused ? '#00048D' : '#808080'} />;
          
          }
        },
        tabBarStyle: {
          backgroundColor: '#f8f8ff',
          borderColor:'#877dfa',
          borderWidth:5,
          borderTopWidth:5,
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4.65,
          elevation: 25,
        },
        tabBarItemStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000000', // Set the default inactive color

        },
        tabBarItemActiveTintColor: '#808080',
        tabBarItemInactiveTintColor: '#00048D',
      })}
    >
      <Tab.Screen name="Home" component={Home}
          options = {{ 
                    headerShown:false, 
                      title:"Home",
                    drawerIcon: ({ color, size }) => (
                     <MaterialCommunityIcons
                     name="home"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
       />
      <Tab.Screen name="Payment" component={PaymentScreen}
          options = {{ 
                    headerShown:false, 
                    title: 'Payment',
                    headerTitleStyle: '#808080',
                    drawerIcon: ({ color, size }) => (
                     <MaterialCommunityIcons
                     name="home"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
       />

      <Tab.Screen name="ChurchAttendance" component={ChurchAttendanceScreen} 
          options = {{ 
                    headerShown:false, 
                    drawerIcon: ({ color, size }) => (
                     <FontAwesome5
                     name="church"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
      />
      <Tab.Screen name="Transaction" component={TransactionScreen} 
          options = {{ 
                    headerShown:false, 
                    drawerIcon: ({ color, size }) => (
                     <MaterialIcons
                     name="payments"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} 
          options = {{ 
                    headerShown:false, 
                    drawerIcon: ({ color, size }) => (
                     <MaterialCommunityIcons
                     name="school"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
      />

    </Tab.Navigator>
  );
};

function DrawerNavigator(){
  const screenOptions = {
    drawerStyle: {
      width: '80%',
    },
    
    drawerContentOptions: {
      activeTintColor: '#ff9900',
      inactiveTintColor: '#999999',
      labelStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    },
  };

  return (
    <Drawer.Navigator
        drawerContent={ props => <DrawerContent {...props} screenOptions={screenOptions} />}
    >
      <Drawer.Screen name="Home " component={BottomTabNavigator} 
         options = {{ 
                    // headerShown:true, 
                    drawerIcon: ({ color, size }) => (
                     <AntDesign
                     name="home"
                     type="material"
                     color={color}
                     size={size}
                     />
                  ),
            }}
      />
     
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <AntDesign
            name="user"
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="User List"
      component={UserListScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <AntDesign
            name="profile"
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="User Payment"
      component={PaymentScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <MaterialIcons
            name="payments"
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="Income / Expense"
      component={TransactionScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="cash-register"
            size={size}
            color={color}
          />
        ),
      }}
    />
    </Drawer.Navigator>
  );
};



export default function AppStack() {

  const handleReset = () => {
    navigation.dispatch(StackActions.reset({
      index: 0,
      routes: [{ name: 'Home' }], // Specify the destination screen/route
    }));
  };
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="App" component={DrawerNavigator}
             options = {{ 
                    headerShown:false, 
                    // title: 'Sidebar'
                    // ...TransitionPresets.RevealFromBottomAndroid 
            }}
       />
      
       

<Stack.Screen 
  name="ExpenseDetailScreen" 
  component={ExpenseDetailScreen} 
  options={({ navigation }) => ({
    title: 'News Update',
    headerTitleStyle: '#808080',
    headerShown: false, 
    headerTitleAlign: 'center', // Aligns the title text to the center
    tabBarIcon: ({ color, size }) => (
      <Ionicons 
        name='book'
        type='material'
        color={color}
        size={size}
      />
    ),
    headerLeft: () => (
      <Ionicons
        name="chevron-back-outline" 
        size={28} 
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 20 }}
      />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>  
    ),
  })}
/>



<Stack.Screen 
  name="ChurchAttendanceScreen" 
  component={ChurchAttendanceScreen} 
  options={({ navigation }) => ({
    title: 'Church Attendance',
    headerTitleStyle: styles.headerTitle,
    headerShown: false, 
    headerTitleAlign: 'center', // Aligns the title text to the center
    tabBarIcon: ({ color, size }) => (
      <Ionicons 
        name='book'
        type='material'
        color={color}
        size={size}
      />
    ),
    headerLeft: () => (
      <Ionicons
        name="chevron-back-outline" 
        size={28} 
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 20 }}
      />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>  
    ),
  })}
/>

<Stack.Screen 
  name="NewMemberDetailScreen" 
  component={NewMemberDetailScreen} 
  options={({ navigation }) => ({
    title: 'New Member Detail',
    headerTitleStyle: styles.headerTitle,
    headerShown: false, 
    headerTitleAlign: 'center', // Aligns the title text to the center
    tabBarIcon: ({ color, size }) => (
      <Ionicons 
        name='book'
        type='material'
        color={color}
        size={size}
      />
    ),
    headerLeft: () => (
      <Ionicons
        name="chevron-back-outline" 
        size={28} 
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 20 }}
      />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>  
    ),
  })}
/>
{/* <Stack.Screen
          name="NewMemberDetailScreen"
          component={NewMemberDetailScreen}
        /> */}
<Stack.Screen 
  name="UserListScreen" 
  component={UserListScreen} 
  options={({ navigation }) => ({
    title: 'User Permissions',
    headerTitleStyle: styles.headerTitle,
    headerShown: false, 
    headerTitleAlign: 'center', // Aligns the title text to the center
    tabBarIcon: ({ color, size }) => (
      <Ionicons 
        name='book'
        type='material'
        color={color}
        size={size}
      />
    ),
    headerLeft: () => (
      <Ionicons
        name="chevron-back-outline" 
        size={28} 
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 20 }}
      />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>  
    ),
  })}
/>
<Stack.Screen 
  name="ChurchAttendance" 
  component={ChurchAttendanceScreen} 
  options={({ navigation }) => ({
    title: 'User Permissions',
    headerTitleStyle: styles.headerTitle,
    headerShown: false, 
    headerTitleAlign: 'center', // Aligns the title text to the center
    tabBarIcon: ({ color, size }) => (
      <Ionicons 
        name='book'
        type='material'
        color={color}
        size={size}
      />
    ),
    headerLeft: () => (
      <Ionicons
        name="chevron-back-outline" 
        size={28} 
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 20 }}
      />
    ),
    headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>  
    ),
  })}
/>

</Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
})