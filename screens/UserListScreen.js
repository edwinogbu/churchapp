import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, SafeAreaView, ScrollView } from 'react-native';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from './../firebase';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUserType, setEditedUserType] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'users'), (snapshot) => {
      const userArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userArr);
    });

    return unsubscribe;
  }, []);

  const updateUserType = async (userId, newUserType) => {
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, { userType: newUserType });
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setEditedUserType(user.userType);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setEditedUserType('');
  };

  const saveChanges = async () => {
    if (!selectedUser) return;

    await updateUserType(selectedUser.id, editedUserType);
    closeModal();
  };

  const handleFilter = () => {
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const renderTableRow = (item, index) => {
    const rowStyle = index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.tableRow, rowStyle]}
        onPress={() => openModal(item)}
      >
        <Text style={styles.serialNumber}>{index + 1}</Text>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userType}>{item.userType}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>User List</Text>

        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Search by name"
            value={searchText}
            onChangeText={setSearchText}
            onBlur={handleFilter}
          />
          <Button title="Filter" onPress={handleFilter} />
        </View>

        <View style={styles.tableContainer}>
          {users.map(renderTableRow)}
        </View>

        <Modal visible={selectedUser !== null} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>Edit User</Text>
                <Text style={styles.modalUser}>{selectedUser.name}</Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="User Type"
                  value={editedUserType}
                  onChangeText={setEditedUserType}
                />

                <View style={styles.buttonContainer}>
                  <Button title="Save Changes" onPress={saveChanges} />
                  <Button title="Cancel" onPress={closeModal} />
                </View>
              </>
            )}
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 4,
  },
  tableContainer: {
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRowEven: {
    backgroundColor: '#f9f9f9',
  },
  tableRowOdd: {
    backgroundColor: '#ffffff',
  },
  serialNumber: {
    fontSize: 14,
    color: '#333',
    width: 50,
    textAlign: 'center',
  },
  userName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  userType: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 20, 20, 0.8)',
    padding: 32,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  modalUser: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  modalInput: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default UserListScreen;
