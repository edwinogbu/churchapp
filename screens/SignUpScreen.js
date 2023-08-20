import React, { useContext, useState, useEffect } from 'react';
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
import { Ionicons, Entypo } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const { signIn, signUp, setUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateName = () => {
    if (name.trim() === '') {
      setNameError('Name is required');
    } else {
      setNameError('');
    }
  };

  const validateEmail = () => {
    if (email.trim() === '') {
      setEmailError('Email is required');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePhone = () => {
    if (phone.trim() === '') {
      setPhoneError('Phone is required');
    } else if (!/^\d{11}$/.test(phone)) {
      setPhoneError('Invalid phone number');
    } else {
      setPhoneError('');
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

  const handleSignUp = async () => {
    validateName();
    validateEmail();
    validatePhone();
    validatePassword();

    if (
      nameError === '' &&
      emailError === '' &&
      phoneError === '' &&
      passwordError === ''
    ) {
      setIsLoading(true); // Show loading indicator

      try {
        const user = await signUp(name, email, phone, password);
        console.log(user);
        setUser({
          name,
          email,
          phone,
          password,
        });

        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setIsLoading(false); // Hide loading indicator
      } catch (error) {
        console.log('Sign up error:', error);
        setIsLoading(false); // Hide loading indicator on error
      }
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={validateName}
            placeholder="Enter Name"
          />
          {nameError !== '' && (
            <Text style={styles.errorText}>{nameError}</Text>
          )}

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
          />
          {emailError !== '' && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            onBlur={validatePhone}
          />
          {phoneError !== '' && (
            <Text style={styles.errorText}>{phoneError}</Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
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
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#877dfa',
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
    paddingVertical: 270,
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
  button: {
    paddingVertical: 16,
    backgroundColor: 'yellow',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
  },
  divider: {
    fontSize: 16,
    color: '#00048D',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 2,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 7,
    marginBottom: 20,
  },
  loginText: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#877dfa',
  },
});


// import React, {useContext, useState,useEffect, useRef} from 'react';
// import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeftIcon } from 'react-native-heroicons/solid';
// import { AuthContext } from './AuthContext';
// import { Ionicons, Entypo } from '@expo/vector-icons';


// export default function SignUpScreen({navigation}) {
// //   const navigation = useNavigation();
//   const { signIn, signUp, setUser } = useContext(AuthContext);


//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   // const [isSignUpModalVisible, setSignUpModalVisible] = useState(false);

//   const validateName = () => {
//     if (name.trim() === '') {
//       setNameError('Name is required');
//     } else {
//       setNameError('');
//     }
//   };
  
//   const validateEmail = () => {
//     if (email.trim() === '') {
//       setEmailError('Email is required');
//     } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
//       setEmailError('Invalid email address');
//     } else {
//       setEmailError('');
//     }
//   };
  
//   const validatePhone = () => {
//     if (phone.trim() === '') {
//       setPhoneError('Phone is required');
//     } else if (!/^\d{11}$/.test(phone)) {
//       setPhoneError('Invalid phone number');
//     } else {
//       setPhoneError('');
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

//   const handleSignUp = async () => {
//     validateName();
//     validateEmail();
//     validatePhone();
//     validatePassword();

//     if (nameError === '' && emailError === '' && phoneError === '' && passwordError === '') {
//       try {
//         const user = await signUp(name, email, phone, password);
//         console.log(user);
//         setUser({
//           name,
//           email,
//           phone,
//           password
//         });
       
//         setName('');
//         setEmail('');
//         setPhone('');
//         setPassword('');
//         // setSignUpModalVisible(false);
//       } catch (error) {
//         console.log('Sign up error:', error);
//       }
//     }
//   };


//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.flex}>
//         <View style={styles.flexRow}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <ArrowLeftIcon size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.flexRowCenter}>
//           <Image
//             source={require('../assets/images/signup.png')}
//             style={styles.image}
//           />
//         </View>
//       </SafeAreaView>
//       <View style={styles.formContainer}>
//         <View style={styles.form}>
//           <Text style={styles.label}>Full Name</Text>
//           <TextInput
//             style={styles.input}
//             value={name}
//               onChangeText={setName}
//               onBlur={validateName}
//             placeholder='Enter Name'
//           />
//           {nameError !== '' && <Text style={styles.errorText}>{nameError}</Text>}

//           <Text style={styles.label}>Email Address</Text>
//           <TextInput
//             style={styles.input}
//             placeholder='Enter Email'
//             value={email}
//               onChangeText={setEmail}
//               onBlur={validateEmail}
//             />
//             {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
//           <Text style={styles.label}>Phone</Text>
//           <TextInput
//               style={styles.input}
//               placeholder="Phone"
//               value={phone}
//               onChangeText={setPhone}
//               onBlur={validatePhone}
//             />
//             {phoneError !== '' && <Text style={styles.errorText}>{phoneError}</Text>}

//           <Text style={styles.label}>Password</Text>
//           <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry={true}
//               value={password}
//               onChangeText={setPassword}
//               onBlur={validatePassword}
//             />
//             {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
//           <TouchableOpacity style={styles.button}
//              onPress={handleSignUp}
//               activeOpacity={0.7}
//           >
//             <Text style={styles.buttonText}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.divider}>Or</Text>
//         <View style={styles.socialButtons}>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image
//               source={require('../assets/icons/google.png')}
//               style={styles.socialIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image
//               source={require('../assets/icons/apple.png')}
//               style={styles.socialIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.socialButton}>
//             <Image
//               source={require('../assets/icons/facebook.png')}
//               style={styles.socialIcon}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.loginContainer}>
//           <Text style={styles.loginText}>Already have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//             <Text style={styles.loginLink}> Login</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#877dfa',
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
//     width: 250,
//     height: 150,
//   },
//   formContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 0,
//     borderTopRightRadius: 50,
//     paddingHorizontal: 34,
//     paddingTop: 20,
//     paddingVertical:270,
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
//   button: {
//     paddingVertical: 16,
//     backgroundColor: 'yellow',
//     borderRadius: 20,
//     alignItems: 'center',
//     marginTop:10,
//   },
//   buttonText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: 'gray',
//   },
//   divider: {
//     fontSize: 16,
//     color: '#00048D',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 2,
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
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 7,
//     marginBottom:20,
//   },
//   loginText: {
//     color: '#333',
//     fontWeight: 'bold',
//     marginBottom:20,
//   },
//   loginLink: {
//     fontWeight: 'bold',
//     color: '#877dfa',
//   },
// });

