import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  // ...other imports...
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc, // Import deleteDoc from Firebase
  updateDoc, // Import updateDoc from Firebase

} from 'firebase/firestore';

import { firestore } from './../firebase';
import NewMemberUpdateModal from './components/NewMemberUpdateModal';

const AccordionRow = ({ header, content }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={toggleAccordion}>
        {header}
        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{content}</View>}
    </View>
  );
};




const ChurchAttendanceScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [state, setState] = useState('');
  // const [country, setCountry] = useState('');
  // const [tribe, setTribe] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [members, setMembers] = useState([]);

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState(null);

  const handleOpenUpdateModal = (rowData) => {
    setSelectedMemberData(rowData);
    setUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedMemberData(null);
    setUpdateModalVisible(false);
  };

  // const handleUpdate = async (updatedMemberData) => {
  //   try {
  //     if (!updatedMemberData.id) {
  //       console.log('Cannot update member: Missing ID');
  //       return;
  //     }

  //     const memberDocRef = doc(firestore, 'newMembers', updatedMemberData.id);
  //     await updateDoc(memberDocRef, updatedMemberData); // Import updateDoc from firebase
  //     fetchMembers();
  //     handleCloseUpdateModal(); // Close the update modal
  //     // You can show a success alert or perform any other necessary actions
  //   } catch (error) {
  //     console.log('Error updating member:', error);
  //   }
  // };

  const handleUpdate = async (updatedMemberData) => {
    try {
      if (!updatedMemberData.id) {
        console.log('Cannot update member: Missing ID');
        return;
      }
  
      const memberDocRef = doc(firestore, 'newMembers', updatedMemberData.id);
      await updateDoc(memberDocRef, updatedMemberData); // Import updateDoc from firebase
      fetchMembers();
      handleCloseUpdateModal(); // Close the update modal
      // You can show a success alert or perform any other necessary actions
    } catch (error) {
      console.log('Error updating member:', error);
    }
  };
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'newMembers'));
      const membersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setMembers(membersData);
    } catch (error) {
      console.log('Error fetching members:', error);
    }
  };
  
  useEffect(() => {
    // const fetchMembers = async () => {
    //   try {
    //     const querySnapshot = await getDocs(collection(firestore, 'newMembers'));
    //     const membersData = querySnapshot.docs.map((doc) => doc.data());
    //     setMembers(membersData);
    //   } catch (error) {
    //     console.log('Error fetching members:', error);
    //   }
    // };
    const fetchMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'newMembers'));
        const membersData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });
        setMembers(membersData);
      } catch (error) {
        console.log('Error fetching members:', error);
      }
    };
    
    fetchMembers();
  }, []);

  const handleDelete = (rowData) => {
    if (!rowData.id) {
      console.log('Cannot delete member: Missing ID');
      return;
    }

    // Show a confirmation dialog
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const memberDocRef = doc(firestore, 'newMembers', rowData.id);
              await deleteDoc(memberDocRef);
              fetchMembers();

              // Show a success alert
              Alert.alert(
                'Member Deleted',
                'The member has been successfully deleted.',
                [
                  { text: 'OK', onPress: () => console.log('Alert closed') }
                ],
                { cancelable: false }
              );
            } catch (error) {
              console.log('Error deleting member:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  // const handleDelete = async (rowData) => {
  //   try {
  //     if (!rowData.id) {
  //       console.log('Cannot delete member: Missing ID');
  //       return;
  //     }

  //     const memberDocRef = doc(firestore, 'newMembers', rowData.id);
  //     await deleteDoc(memberDocRef);
  //     fetchMembers();

  //     // Show a custom popup alert
  //     Alert.alert(
  //       'Member Deleted',
  //       'The member has been successfully deleted.',
  //       [
  //         { text: 'OK', onPress: () => console.log('Alert closed') }
  //       ],
  //       { cancelable: false }
  //     );
  //   } catch (error) {
  //     console.log('Error deleting member:', error);
  //   }
  // };



//   const handleDelete = async (rowData) => {
//     try {
//       if (!rowData.id) {
//         console.log('Cannot delete member: Missing ID');
//         return;
//       }
      
//       const memberDocRef = doc(firestore, 'newMembers', rowData.id);
//       await deleteDoc(memberDocRef);
//       fetchMembers();
//     } catch (error) {
//       console.log('Error deleting member:', error);
//     }
//   };
// 9
  const saveTransToFirestore = async (memberData) => {
    try {
      const memberDataRef = collection(firestore, 'newMembers');
      await addDoc(memberDataRef, memberData);
    } catch (error) {
      console.log('Error saving member data to Firestore:', error);
    }
  };

  const handleAddMember = () => {
    const memberData = {
      name,
      email,
      phone,
      address,
      prayerRequest,
      state,
      // country,
      // tribe,
      date: formattedDate,
    };

    saveTransToFirestore(memberData);

    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPrayerRequest('');
    setState('');
    // setCountry('');
    // setTribe('');

    setModalVisible(false);
    fetchMembers();
  };

  const handleNavigateToMemberDetail = (rowData) => {
    navigation.navigate('NewMemberDetailScreen', { rowData });
  };

  const renderTableHeader = () => {
    return (
      <View style={styles.tableHeaderContainer}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Phone</Text>
        <Text style={styles.headerText}>Prayer Request</Text>
      </View>
    );
  };

  // const renderTableRow = (rowData) => {
  //   const { name, phone, prayerRequest } = rowData;

  //   return (
  //     <TouchableOpacity
  //       style={styles.tableRowContainer}
  //       onPress={() => handleNavigateToMemberDetail(rowData)}
  //     >
  //       <Text style={styles.rowText}>{name}</Text>
  //       <Text style={styles.rowText}>{phone}</Text>
  //       <Text style={styles.rowText}>{prayerRequest}</Text>
  //     </TouchableOpacity>
  //   );
  // };

  // const handleDelete = async (rowData) => {
  //   try {
  //     const memberDocRef = doc(firestore, 'newMembers', rowData.id);
  //     await deleteDoc(memberDocRef);
  //     fetchMembers();
  //   } catch (error) {
  //     console.log('Error deleting member:', error);
  //   }
  // };

  // const fetchMembers = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(firestore, 'newMembers'));
  //     const membersData = querySnapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       return { id: doc.id, ...data };
  //     });
  //     setMembers(membersData);
  //   } catch (error) {
  //     console.log('Error fetching members:', error);
  //   }
  // };
  
  // const handleDelete = async (rowData) => {
  //   try {
  //     if (!rowData.id) {
  //       console.log('Cannot delete member: Missing ID');
  //       return;
  //     }
      
  //     const memberDocRef = doc(firestore, 'newMembers', rowData.id);
  //     await deleteDoc(memberDocRef);
  //     fetchMembers();
  //   } catch (error) {
  //     console.log('Error deleting member:', error);
  //   }
  // };
  // const renderTableRow = (rowData) => {
  //     const { id, name, phone, prayerRequest } = rowData;
  //   return (
  //     <AccordionRow
  //       header={(
  //         <View style={styles.tableRowContainer}>
  //         <TouchableOpacity  style={styles.rowText}  onPress={() => handleNavigateToMemberDetail(rowData)}>

  //           <Text style={{ ...styles.rowText, color:'#FFF'}} >{name}</Text>
  //         </TouchableOpacity>
  //           <Text style={styles.rowText}>{phone}</Text>
  //           <Text style={styles.rowText}>{prayerRequest}</Text>
  //         </View>
  //       )}
  //       content={(
  //       <View style={styles.expandedContent}>
  //         <TouchableOpacity style={styles.updateButton} onPress={() => handleOpenUpdateModal(rowData)}>
  //           <Text style={styles.buttonText}>Update</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(rowData)}>
  //           <Text style={styles.buttonText}>Delete</Text>
  //         </TouchableOpacity>
  //       </View>
  //     )}
  //     />
  //   );
  // };

  // const renderTableRow = (rowData) => {
  //   const { name, phone, prayerRequest } = rowData;
  
  //   return (
  //     <AccordionRow
  //       header={(
  //         <TouchableOpacity
  //           style={styles.tableRowContainer}
  //           onPress={() => handleNavigateToMemberDetail(rowData)}
  //         >
  //           <Text style={{ ...styles.rowText, color: '#FFF' }}>{name}</Text>
  //           <Text style={styles.rowText}>{phone}</Text>
  //           <Text style={styles.rowText}>{prayerRequest}</Text>
  //         </TouchableOpacity>
  //       )}
  //       content={(
  //         <View style={styles.expandedContent}>
  //           <TouchableOpacity style={styles.updateButton} onPress={() => handleOpenUpdateModal(rowData)}>
  //             <Text style={styles.buttonText}>Update</Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(rowData)}>
  //             <Text style={styles.buttonText}>Delete</Text>
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //     />
  //   );
  // };
  
  const renderTableRow = (rowData) => {
    const { 
      name,  email, phone, address, prayerRequest,  state, } = rowData;
  
    return (
      <AccordionRow
        header={(
          <TouchableOpacity
            style={styles.tableRowContainer}
            onPress={() => handleNavigateToMemberDetail(rowData)}
          >
            <Text style={{ ...styles.rowText, color: '#FFF' }}>{name}</Text>
            <Text style={styles.rowText}>{phone}</Text>
            <Text style={styles.rowText}>{prayerRequest}</Text>
          </TouchableOpacity>
        )}
        content={(
          <View style={styles.expandedContent}>
            <TouchableOpacity style={styles.updateButton} onPress={() => handleOpenUpdateModal(rowData)}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(rowData)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };
  
  const renderTableContent = () => {
    return (
      <View style={styles.tableContentContainer}>
        {members.map((rowData, index) => (
          <View key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
            {renderTableRow(rowData)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonLabel}>Add Members</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <MaterialIcons name="search" size={24} color="black" style={styles.filterIcon} />
        <TextInput
          style={styles.filterInput}
          placeholder="Search"
          value={searchFilter}
          onChangeText={setSearchFilter}
        />
      </View>

      {renderTableHeader()}
      <ScrollView>
        {renderTableContent()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Member</Text>

            <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingContainer}>
              <ScrollView>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={phone}
                  onChangeText={setPhone}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={styles.textarea}
                  placeholder="Prayer Request"
                  value={prayerRequest}
                  onChangeText={setPrayerRequest}
                />
                <TextInput
                  style={styles.input}
                  placeholder="State origin"
                  value={state}
                  onChangeText={setState}
                />
                {/* <TextInput
                  style={styles.input}
                  placeholder="Country"
                  value={country}
                  onChangeText={setCountry}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tribe"
                  value={tribe}
                  onChangeText={setTribe}
                /> */}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleAddMember}>
                    <Text style={styles.saveButtonLabel}>Save Member</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonLabel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
      <NewMemberUpdateModal
        isVisible={updateModalVisible}
        onClose={handleCloseUpdateModal}
        memberData={selectedMemberData} // Pass the selected member data to the modal
        onUpdate={handleUpdate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#877dfa',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf:'flex-end',
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFF4',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: 'bold',
  },
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
    borderRadius:25,
    backgroundColor:'#CCF',
    color:'#000',
    fontSize:16,
    fontWeight:'bold'
  },
  textarea: {
    height: 80,
    borderColor: '#877dfa',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    borderRadius:18,
    color:'#000',
    fontSize:16,
    fontWeight:'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#877dfa',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F3113A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  tableContentContainer: {
    marginBottom: 8,
  },
  evenRow: {
    backgroundColor: '#ECECEC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  oddRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  tableRowContainer: {
    flexDirection: 'row',
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold'
  },


  accordionContainer: {
    marginBottom: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#877dfa',
    paddingVertical: 2,
    paddingHorizontal: 26,
    borderRadius: 8,
    marginBottom: 1,
  },
  accordionContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  expandedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This will space the buttons apart
    alignItems: 'center', // Vertically center the buttons
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },


});

export default ChurchAttendanceScreen;
