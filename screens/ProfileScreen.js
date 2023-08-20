
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore } from './../firebase';
import { AuthContext } from './AuthContext';


const getUserIdFromFirestore = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    throw new Error('User is not logged in');
  }
};

const ProfileField = ({ label, value, editing, onChangeText }) => {
  return (
    <>
      <Text style={styles.label}>{label}:</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={text => onChangeText(text)}
        />
      ) : (
        <Text style={styles.text}>{value}</Text>
      )}
    </>
  );
};

const EditButton = ({ onPress }) => (
  <TouchableOpacity style={styles.editButton} onPress={onPress}>
    <Icon name="edit" size={20} color="#FFF" />
    <Text style={styles.editButtonText}>Edit</Text>
  </TouchableOpacity>
);

const SaveCancelButton = ({ onSave, onCancel }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
      <View style={styles.buttonContent}>
        <Icon name="close" size={20} color="#FFF" />
        <Text style={styles.editButtonText}>Close</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
      <View style={styles.buttonContent}>
        <Icon name="check" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Update</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const ProfileScreen = () => {
  const {
    state: {
      user: { displayName = '', name = '', email = '', phoneNumber = '', phone = '', image = null },
    },
  } = useContext(AuthContext);

  const [userDetails, setUserDetails] = useState({
    name: displayName || name || '',
    email: email || '',
    phone: phoneNumber || phone || '',
    image: image || null,
  });
  const [editing, setEditing] = useState(false);
  const [originalUserDetails, setOriginalUserDetails] = useState({});
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchUserDetails();
    setGreeting(getGreeting());
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userId = await getUserIdFromFirestore();
      const userDocRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData);
        setOriginalUserDetails(userData);
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { uid, email, displayName, phoneNumber, photoURL } = currentUser;
          const updatedUserDetails = {
            ...userDetails,
            userId: uid,
            email: userDetails.email || email || '',
            name: userDetails.name || displayName || '',
            phone: userDetails.phone || phoneNumber || '',
            image: userDetails.image || photoURL || null,
          };
          setUserDetails(updatedUserDetails);
          setOriginalUserDetails(updatedUserDetails);
        }
      }
    } catch (error) {
      console.log('Error fetching user details:', error.message);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const userId = await getUserIdFromFirestore();
      const userDocRef = doc(firestore, 'users', userId);
      const updatedUserDetails = { ...userDetails, userId };
      await setDoc(userDocRef, updatedUserDetails, { merge: true });
      setEditing(false);
      setOriginalUserDetails(updatedUserDetails);
      console.log('User details updated successfully.');
    } catch (error) {
      console.log('Error updating user details:', error.message);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setUserDetails(originalUserDetails);
  };

  const handleInputChange = (key, value) => {
    setUserDetails(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        console.log('Permission to access media library denied');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!pickerResult.cancelled) {
        const storage = getStorage();
        const imageRef = ref(storage, `users/${userDetails.userId}/profileImage`);
        await uploadBytes(imageRef, pickerResult.uri);
        const imageUrl = await getDownloadURL(imageRef);
        setUserDetails(prevState => ({
          ...prevState,
          image: imageUrl,
        }));
      }
    } catch (error) {
      console.log('Error uploading image:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
    
      <View style={styles.card}>
        <Text style={styles.greeting}>{greeting}</Text>

        <TouchableOpacity onPress={handleImageUpload}>
          {userDetails.image ? (
            <Image source={{ uri: userDetails.image }} style={styles.image} />
          ) : (
            <Icon name="user" size={80} color="#CCCCCC" />
          )}
        </TouchableOpacity>

        <ProfileField
          label="Name"
          value={userDetails.name}
          editing={editing}
          onChangeText={text => handleInputChange('name', text)}
        />

        <ProfileField
          label="Email"
          value={userDetails.email}
          editing={editing}
          onChangeText={text => handleInputChange('email', text)}
        />

        <ProfileField
          label="Phone"
          value={userDetails.phone}
          editing={editing}
          onChangeText={text => handleInputChange('phone', text)}
        />

        {editing ? (
          <SaveCancelButton onSave={handleUpdate} onCancel={handleCancel} />
        ) : (
          <EditButton onPress={handleEdit} />
        )}
      </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CD964',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },



  card: {
    width: '80%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 20,
    marginTop: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '900',
    padding: 10,
  },
 
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  



});

export default ProfileScreen;
