// // AuthProvider.js
// import React, { createContext, useReducer, useState, useEffect } from 'react';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import * as SecureStore from 'expo-secure-store';
// import { auth, firestore, storage } from './../firebase';
// import authReducer, { initialState } from './authReducer';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const [error, setError] = useState(null); // Error state

//   const setUser = (user) => {
//     dispatch({ type: 'SET_USER', payload: user });
//   };

//   const signIn = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       dispatch({ type: 'SIGN_IN', payload: user });
//       return user;
//     } catch (error) {
//       setError(error.message);
//       return null;
//     }
//   };

//   const signUp = async (email, password, name, phone) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       await saveUserDetail(user, { name, phone });
//       dispatch({ type: 'SIGN_UP', payload: user });
//       return user;
//     } catch (error) {
//       setError(error.message);
//       return null;
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       dispatch({ type: 'SIGN_OUT' });
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const saveUserDetail = async (user, userData) => {
//     try {
//       // Save user details to Firestore
//       const userDocRef = doc(firestore, 'users', user.uid);
//       await setDoc(userDocRef, userData);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const uploadProfilePicture = async (user, imageUri) => {
//     try {
//       // Upload the profile picture to Firebase Storage and get the download URL
//       const storageRef = ref(storage, `profilePictures/${user.uid}`);
//       await uploadBytes(storageRef, imageUri);
//       const downloadURL = await getDownloadURL(storageRef);
//       // Update the user profile with the new picture
//       await updateProfile(user, { photoURL: downloadURL });
//       setUser({ ...user, photoURL: downloadURL });
//       return downloadURL;
//     } catch (error) {
//       setError(error.message);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUser(user);

//         // Fetch additional user data from Firestore and merge it into the user object
//         try {
//           const userDocRef = doc(firestore, 'users', user.uid);
//           const userDocSnapshot = await getDoc(userDocRef);
//           if (userDocSnapshot.exists()) {
//             const userData = userDocSnapshot.data();
//             setUser({ ...user, ...userData });
//           } else {
//             const defaultUserData = {
//               name: '',
//               phone: '',
//             };
//             await setDoc(userDocRef, defaultUserData);
//             setUser({ ...user, ...defaultUserData });
//           }
//         } catch (error) {
//           setError(error.message);
//         }
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         state,
//         setUser,
//         signIn,
//         signUp,
//         signOut: handleSignOut,
//         saveUserDetail,
//         uploadProfilePicture,
//         error,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };



// AuthProvider.js
import React, { createContext, useReducer, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as SecureStore from 'expo-secure-store';
import { auth, firestore, storage } from './../firebase';
// import authReducer, { initialState } from './authReducer';
import authReducer from './authReducer';
export const AuthContext = createContext();

const initialState = {
  user: null,
  username: '',
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [error, setError] = useState(null); // Error state

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({ type: 'SIGN_IN', payload: user });
      return user;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const signUp = async (email, password, name, phone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = { email, password, name, phone };

      // Save user details to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, userData);

      // Save user with default role to userPermission collection
      const defaultRole = 'user';
      const userPermissionDocRef = await addDoc(collection(firestore, 'userPermission'), {
        userId: user.uid,
        role: defaultRole,
      });

      dispatch({ type: 'SIGN_UP', payload: user });
      return user;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Other functions remain the same
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      setError(error.message);
    }
  };


  const uploadProfilePicture = async (user, imageUri) => {
    try {
      // Upload the profile picture to Firebase Storage and get the download URL
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, imageUri);
      const downloadURL = await getDownloadURL(storageRef);
      // Update the user profile with the new picture
      await updateProfile(user, { photoURL: downloadURL });
      setUser({ ...user, photoURL: downloadURL });
      return downloadURL;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch additional user data from Firestore and merge it into the user object
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUser({ ...user, ...userData });
          } else {
            const defaultUserData = {
              name: '',
              phone: '',
            };
            await setDoc(userDocRef, defaultUserData);
            setUser({ ...user, ...defaultUserData });
          }
        } catch (error) {
          setError(error.message);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        setUser,
        signIn,
        signUp,
        signOut: handleSignOut,
        uploadProfilePicture,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useReducer, useState, useEffect } from 'react';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import * as SecureStore from 'expo-secure-store';
// import { auth, firestore, storage } from './../firebase';


// import authReducer from './authReducer';

// const initialState = {
//   user: null,
//   username: '',
// };

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//   const [error, setError] = useState(null); // Error state

//   useEffect(() => {
//     // Load user state from SecureStore on component mount
//     loadUserState();
//   }, []);

//   const setUser = (user) => {
//     dispatch({ type: 'SET_USER', payload: user });
//     saveValueToSecureStore('user', user);
//   };

//   const signIn = async (email, password) => {
//     dispatch({ type: 'SET_LOADING', payload: true });
//     setError(null); // Clear previous errors
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       dispatch({ type: 'SIGN_IN', payload: user });
//       saveValueToSecureStore('user', user);
//     } catch (error) {
//       console.log('Sign in error:', error);
//       setError('Sign in failed. Please check your credentials and try again.'); // Set error message
//     }
//   };

//   const signUp = async (name, email, phone, password, profilePicture) => {
//     dispatch({ type: 'SET_LOADING', payload: true });
//     setError(null); // Clear previous errors
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       // Update user profile with additional fields
//       await updateProfile(user, { displayName: name, phoneNumber: phone, userId: user.uid });
      
//       // Save user details to Firestore
//       await saveUserDetail(user.uid, { name, email, phone, userId: user.uid });
      
//       // Upload profile picture to Cloud Storage
//       const profilePictureUrl = await uploadProfilePicture(user.uid, profilePicture);
      
//       // Update user profile with profile picture URL
//       await updateProfile(user, { photoURL: profilePictureUrl });
      
//       dispatch({ type: 'SIGN_UP', payload: user }); // Use 'SIGN_UP' action type
//       saveValueToSecureStore('user', user);
//     } catch (error) {
//       console.log('Sign up error:', error);
//       setError('Sign up failed. Please try again.'); // Set error message
//     }
//   };

//   const handleSignOut = async () => {
//     dispatch({ type: 'SET_LOADING', payload: true });
//     setError(null); // Clear previous errors
//     try {
//       await signOut(auth);
//       dispatch({ type: 'SIGN_OUT' });
//       deleteValueFromSecureStore('user');
//     } catch (error) {
//       console.log('Sign out error:', error);
//       setError('Sign out failed. Please try again.'); // Set error message
//     }
//   };

//   const saveUserDetail = async (userId, userDetails) => {
//     const userDocRef = doc(firestore, 'users', userId);
//     setError(null); // Clear previous errors
//     try {
//       await setDoc(userDocRef, userDetails, { merge: true }); // Use 'userDetails' directly without wrapping it
//       console.log('User details saved successfully.');
//     } catch (error) {
//       console.log('Error saving user details:', error);
//       setError('Failed to save user details. Please try again.'); // Set error message
//     }
//   };

//   const uploadProfilePicture = async (userId, file) => {
//     const profilePictureRef = ref(storage, `profilePictures/${userId}`);
//     try {
//       await uploadBytes(profilePictureRef, file);
//       const profilePictureUrl = await getDownloadURL(profilePictureRef);
//       return profilePictureUrl;
//     } catch (error) {
//       console.log('Error uploading profile picture:', error);
//       setError('Failed to upload profile picture. Please try again.'); // Set error message
//       return null;
//     }
//   };

//   const saveValueToSecureStore = async (key, value) => {
//     try {
//       const valueString = JSON.stringify(value);
//       await SecureStore.setItemAsync(key, valueString);
//     } catch (error) {
//       console.log(`Error saving ${key} to SecureStore:`, error);
//     }
//   };

//   const deleteValueFromSecureStore = async (key) => {
//     try {
//       await SecureStore.deleteItemAsync(key);
//     } catch (error) {
//       console.log(`Error deleting ${key} from SecureStore:`, error);
//     }
//   };

//   const loadUserState = async () => {
//     try {
//       const userString = await SecureStore.getItemAsync('user');
//       console.log('Retrieved userString:', userString); // Log the userString value
//       if (userString) {
//         const user = JSON.parse(userString);
//         console.log('Parsed user:', user); // Log the parsed user object
//         dispatch({ type: 'SET_USER', payload: user });
//       }
//       dispatch({ type: 'SET_LOADING', payload: false });
//     } catch (error) {
//       console.log('Error loading user state:', error);
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         state,
//         setUser,
//         signIn,
//         signUp,
//         signOut: handleSignOut,
//         saveUserDetail,
//         uploadProfilePicture,
//         error,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

