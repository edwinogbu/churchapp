import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { AuthContext } from './AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn, signUp, setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (email.trim() === '') {
      setEmailError('Email is required');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (password.trim() === '') {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSignIn = () => {
    validateEmail();
    validatePassword();

    if (emailError === '' && passwordError === '') {
      setIsLoading(true); // Show loading indicator

      signIn(email, password)
        .then(() => {
          setEmail('');
          setPassword('');
          setIsLoading(false); // Hide loading indicator on success
        })
        .catch((error) => {
          console.log('Sign in error:', error);
          setIsLoading(false); // Hide loading indicator on error
        });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#877dfa' }]}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.flexRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.flexRowCenter}>
          <View style={styles.imageContainer}>
            <Image source={require("../assets/images/apostle-fire.jpg")} style={styles.image} />
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
          />
          {emailError !== '' && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            onBlur={validatePassword}
          />
          {passwordError !== '' && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.divider}>Or</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/icons/google.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/icons/apple.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../assets/icons/facebook.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00048D',
  },
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    backgroundColor: 'yellow',
    padding: 8,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    marginLeft: 4,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 50,
    paddingHorizontal: 34,
    paddingTop: 20,
    paddingVertical: 70,
  },
  form: {
    marginBottom: 1,
  },
  label: {
    color: '#00048D',
    fontSize: 16,
    marginBottom: 1,
    marginLeft: 14,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    backgroundColor: '#ECECEC',
    color: '#333',
    borderRadius: 20,
    marginBottom: 3,
    fontWeight: '900',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#877dfa',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 9,
    backgroundColor: 'yellow',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
  },
  divider: {
    fontSize: 20,
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 2,
  },
  socialButton: {
    padding: 8,
    backgroundColor: '#ECECEC',
    borderRadius: 50,
    marginHorizontal: 4,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 7,
    marginBottom: 20,
  },
  signUpText: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signUpLink: {
    fontWeight: 'bold',
    color: '#877dfa',
  },
});


// import React,{useContext, useState, useEffect} from 'react';
// import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeftIcon } from 'react-native-heroicons/solid';
// import { themeColors } from './../constants/theme';
// import { AuthContext } from './AuthContext';

// export default function LoginScreen({navigation}) {
//   const { signIn, signUp, setUser } = useContext(AuthContext);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const validateEmail = () => {
//     if (email.trim() === '') {
//       setEmailError('Email is required');
//     } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
//       setEmailError('Invalid email address');
//     } else {
//       setEmailError('');
//     }
//   };

//   const validatePassword = () => {
//     if (password.trim() === '') {
//       setPasswordError('Password is required');
//     } else if (password.length < 6) {
//       setPasswordError('Password should be at least 6 characters');
//     } else {
//       setPasswordError('');
//     }
//   };


//   const handleSignIn = () => {
//     validateEmail();
//     validatePassword();

//     if (emailError === '' && passwordError === '') {
//       signIn(email, password);
//       setEmail('');
//       setPassword('');
//     }
//   };

//   return (
//     <View style={[styles.container, {backgroundColor:'#877dfa'}]}>
//       <SafeAreaView style={styles.flex}>
//         <View style={styles.flexRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <ArrowLeftIcon size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.flexRowCenter}>
//           <Image source={require('../assets/images/login.png')} style={styles.image} />
//         </View>
//       </SafeAreaView>
//       <View style={styles.formContainer}>
//         <View style={styles.form}>
//           <Text style={styles.label}>Email Address</Text>  
//           <TextInput
//               style={styles.input}
//               placeholder="Email"
//               value={email}
//               onChangeText={setEmail}
//               onBlur={validateEmail}
//             />
//             {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
          
//           <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry={true}
//               value={password}
//               onChangeText={setPassword}
//               onBlur={validatePassword}
//             />
//             {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}

//           <TouchableOpacity style={styles.forgotPassword}>
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.loginButton}  onPress={handleSignIn}>
//             <Text style={styles.loginButtonText}>Login</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.divider}>Or</Text>
//         <View style={styles.socialButtons}>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image source={require('../assets/icons/google.png')} style={styles.socialIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image source={require('../assets/icons/apple.png')} style={styles.socialIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image source={require('../assets/icons/facebook.png')} style={styles.socialIcon} />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.signUpContainer}>
//           <Text style={styles.signUpText}>Don't have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//             <Text style={styles.signUpLink}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#00048D',
//   },
//   flex: {
//     flex: 1,
//   },
//   flexRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//   },
//   backButton: {
//     backgroundColor: 'yellow',
//     padding: 8,
//     borderTopRightRadius: 40,
//     borderBottomRightRadius: 40,
//     marginLeft: 4,
//   },
//   flexRowCenter: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   image: {
//     width: 200,
//     height: 200,
//   },
//   formContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 50,
//     paddingHorizontal: 34,
//     paddingTop: 20,
//     paddingVertical:70,
//   },
//   form: {
//     marginBottom: 1,
//   },
//   label: {
//     color: '#00048D',
//     fontSize: 16,
//     marginBottom: 1,
//     marginLeft: 14,
//     fontWeight: 'bold',
//   },
//   input: {
//     padding: 12,
//     backgroundColor: '#ECECEC',
//     color: '#333',
//     borderRadius: 20,
//     marginBottom: 3,
//     fontWeight:'900',
//     fontSize: 16,
//   },
//   forgotPassword: {
//     alignItems: 'flex-end',
//   },
//   forgotPasswordText: {
//     color: '#877dfa',
//     marginBottom: 5,
//     fontWeight:'bold'
//   },
//   loginButton: {
//     paddingVertical: 9,
//     backgroundColor: 'yellow',
//     borderRadius: 20,
//   },
//   loginButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: 'gray',
//   },
//   divider: {
//     fontSize: 20,
//     color: 'gray',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 5,
//   },
//   socialButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//     marginTop: 2,
//   },
//   socialButton: {
//     padding: 8,
//     backgroundColor: '#ECECEC',
//     borderRadius: 50,
//     marginHorizontal: 4,
//   },
//   socialIcon: {
//     width: 40,
//     height: 40,
    
//   },
//   signUpContainer: {
//     flexDirection: 'row',
//   justifyContent: 'center',
//   marginTop: 7,
//   marginBottom:20,
//   },
//   signUpText: {
//     color: '#333',
//     fontWeight: 'bold',
//     marginBottom:20,
//   },
//   signUpLink: {
//     fontWeight: 'bold',
//     color: '#877dfa',
//   },
// });

