// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { themeColors } from './../theme';

// export default function WelcomeScreen({ navigation }) {
//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bg }]}>
//       <View style={styles.contentContainer}>
//       <Text style={styles.title}> {`Believers Mgt. App`}</Text>
//         <Text style={{color:'#FFF', textAlign:'center', fontSize:16, fontWeight:'bold'}}> {`Pneuma Luminosity!`}</Text>
//         <View style={styles.imageContainer}>
//           <Image source={require("../assets/images/envoys.jpg")} style={styles.image} />
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button}>
//             <Text style={styles.buttonText}>Sign Up</Text>
//           </TouchableOpacity>
//           <View style={styles.loginContainer}>
//             <Text style={styles.loginText}>Already have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//               <Text style={[styles.loginText, styles.loginLink]}> Log In</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'space-around',
//     marginVertical: 4,
//   },
//   title: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 40,
//     textAlign: 'center',
//   },
//   imageContainer: {

//     borderRadius:50,
//   },
//   image: {

//     borderRadius:50,
//   },
//   buttonContainer: {
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: 'yellow',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginHorizontal: 7,
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#877dfa',
//     textAlign: 'center',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   loginText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize:19,
//   },
//   loginLink: {
//     color: 'yellow',
//     borderColor:'#FFF',
//     borderWidth:1,
//     borderRadius:5,
//     backgroundColor:'#877dfa',
//     padding:5,

//   },
// });

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { themeColors } from './../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <View style={styles.contentContainer}>
    <Text style={styles.title}> {`
    Church Mgt.
    App
    `}</Text>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/apostle-fire.jpg")} style={styles.image} />
        </View>
        <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}> {`Pneuma Luminosity!`}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginText, styles.loginLink]}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  image: {
    width: 200, // Set the desired width
    height: 200, // Set the desired height
    borderRadius: 100, // Make the image round
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'yellow',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 7,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#877dfa',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
  },
  loginLink: {
    color: 'yellow',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#877dfa',
    padding: 5,
  },
});
