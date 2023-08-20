import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// const NewMemberUpdateModal = ({ isVisible, onClose, memberData, onUpdate }) => {
//   const [updatedName, setUpdatedName] = useState(memberData.name);
//   const [updatedPhone, setUpdatedPhone] = useState(memberData.phone);
//   const [updatedPrayerRequest, setUpdatedPrayerRequest] = useState(memberData.prayerRequest);

//   const handleUpdate = () => {
//     const updatedMemberData = {
//       id: memberData.id,
//       name: updatedName,
//       phone: updatedPhone,
//       prayerRequest: updatedPrayerRequest,
//     };
//     onUpdate(updatedMemberData);
//     onClose();
//   };
const NewMemberUpdateModal = ({ isVisible, onClose, memberData, onUpdate }) => {
    // Check if memberData is null, and provide default values if it is
    const initialName = memberData ? memberData.name : '';
    const initialEmail = memberData ? memberData.email : '';
    const initialPhone = memberData ? memberData.phone : '';
    const initialAddress = memberData ? memberData.address : '';
    const initialPrayerRequest = memberData ? memberData.prayerRequest : '';
    const initialState = memberData ? memberData.state : '';
  
    const [updatedName, setUpdatedName] = useState(initialName);
    const [updatedPhone, setUpdatedPhone] = useState(initialPhone);
    const [updatedPrayerRequest, setUpdatedPrayerRequest] = useState(initialPrayerRequest);
    const [updatedEmail, setUpdatedEmail] = useState(initialEmail);
    const [updatedAddress, setUpdatedAddress] = useState(initialAddress);
    const [updatedState, setUpdatedState] = useState(initialState);
    
    
    
    
    
    useEffect(() => {
      // Set initial values when memberData changes
      setUpdatedName(memberData ? memberData.name : '');
      setUpdatedEmail(memberData ? memberData.email : '');
      setUpdatedPhone(memberData ? memberData.phone : '');
      setUpdatedAddress(memberData ? memberData.address : '');
      setUpdatedPrayerRequest(memberData ? memberData.prayerRequest : '');
      setUpdatedState(memberData ? memberData.state : '');
    }, [memberData]);
  
    const handleUpdate = () => {
      const updatedMemberData = {
        id: memberData.id,
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone,
        address: updatedAddress,
        prayerRequest: updatedPrayerRequest,
        state: updatedState,
      };
      onUpdate(updatedMemberData);
      onClose();
    };
  
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Update Member</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={updatedName}
            onChangeText={setUpdatedName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={updatedEmail}
            onChangeText={setUpdatedEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={updatedPhone}
            onChangeText={setUpdatedPhone}
          />
          <TextInput
            style={styles.textarea}
            placeholder="Address"
            value={updatedAddress}
            onChangeText={setUpdatedAddress}
          />
          <TextInput
            style={styles.textarea}
            placeholder="Prayer Request"
            value={updatedPrayerRequest}
            onChangeText={setUpdatedPrayerRequest}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={updatedState}
            onChangeText={setUpdatedState}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#877dfa',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    backgroundColor: '#CCF',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textarea: {
    height: 80,
    borderColor: '#877dfa',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    borderRadius: 18,
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  updateButton: {
    backgroundColor: '#4CAF50', // Green hex code color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#F3113A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewMemberUpdateModal;
