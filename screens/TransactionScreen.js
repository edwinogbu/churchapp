// import {useState, useRef, useEffect } from 'react';
// import { View, Button, Modal, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Animated } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';
// import { firestore } from './../firebase';
// import { COLORS, FONTS, SIZES, icons, images } from './../constants';
// import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

// const TransactionScreen = ({ navigation }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [categoryModalVisible, setCategoryModalVisible] = useState(false);
//   const [latestTransaction, setLatestTransaction] = useState(null);
//   const [categoryName, setCategoryName] = useState('');
//   const [transactionType, setTransactionType] = useState('');
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState('');
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const [pageNumber, setPageNumber] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const lastVisibleIndex = pageNumber * itemsPerPage;

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(firestore, 'transactions'), (snapshot) => {
//       const transactions = snapshot.docs.map((doc) => doc.data());
//       setLatestTransaction(transactions);
//     });

//     // Clean up the subscription when the component unmounts
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnim]);

//   const handleFilter = (filterText) => {
//     if (latestTransaction) {
//       const filteredTransactions = latestTransaction.filter((transaction) =>
//         transaction.title.toLowerCase().includes(filterText.toLowerCase())
//       );
//       setFilteredData(filteredTransactions);
//       setPageNumber(1);
//     }
//   };

//   const handleLoadMore = () => {
//     setPageNumber((prevPageNumber) => prevPageNumber + 1);
//   };

//   const transactionTypes = ['income', 'expense'];
//   const categoryListHeightAnimationValue = useRef(new Animated.Value(115)).current;

//   const saveTransaction = () => {
//     const transactionData = {
//       categoryName,
//       transactionType,
//       title,
//       description,
//       amount,
//       date,
//       status: "pending",
//     };

//     saveTransToFirestore(transactionData);

//     setLatestTransaction({ title, description, amount, date });

//     setCategoryName('');
//     setTransactionType('');
//     setTitle('');
//     setDescription('');
//     setAmount('');
//     setDate('');

//     setModalVisible(false);
//   };

//   const saveTransToFirestore = async (transactionData) => {
//     try {
//       const transactionRef = collection(firestore, 'transactions');
//       await addDoc(transactionRef, transactionData);
//     } catch (error) {
//       console.log('Error saving transaction to Firestore');
//     }
//   };

//   const handleDateConfirm = (date) => {

//     setSelectedDate(date);
//     setDatePickerVisibility(false);

//     const setDatePickerVisibility = (visible) => {
//       setDatePickerVisibility(visible);
//     };
    
//     // Format the selected date
//     const formattedDate = date.toLocaleDateString('en-US');

//     // Set the formatted date in the 'date' state
//     setDate(formattedDate);
//   };

//   const saveCategory = async () => {
//     try {
//       const categoryData = {
//         categoryName: categoryName,
//       };

//       const categoryRef = collection(firestore, 'categories');
//       await addDoc(categoryRef, categoryData);

//       setCategoryModalVisible(false);
//       setCategoryName('');
//     } catch (error) {
//       console.error('Error saving category to Firestore:', error);
//     }
//   };


  
//   const renderLatestTransactionItem = ({ item }) => {
//     const { title, description, amount, date } = item;
//     let displayedDescription = description;
//     let readMoreLink = null;

//     // Split the note by spaces to count words
//     const words = description.split(' ');

//     // Check if the note exceeds 3 words or 20 characters
//     if (words.length > 3 || description.length > 20) {
//       displayedDescription = words.slice(0, 3).join(' ');
//       readMoreLink = '... Read More';
//     }

//     return (
//       <TouchableOpacity
//         style={[styles.listItem, { opacity: fadeAnim }]}
//         onPress={() => navigation.navigate('ExpenseDetailScreen', { item })}
//       >
//         <View style={styles.contentContainer}>
//           <View style={styles.iconContainer}>
//             <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
//           </View>
//           <View style={styles.textContainer}>
//             <Text style={styles.titleText}>{title}</Text>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text>
//               {displayedDescription}
//               {readMoreLink && <Text style={styles.readMoreLink}>{readMoreLink}</Text>}
//             </Text>
//           </View>
//           <View style={styles.imageContainer}>
//             <Text style={styles.titleText}>{amount}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderLatestTransactionList = () => (
//     <Animated.View>
//       {latestTransaction && (
//         <FlatList
//           data={latestTransaction.slice(0, lastVisibleIndex)}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderLatestTransactionItem}
//           contentContainerStyle={styles.flatListContainer}
//           ListFooterComponent={<Text style={styles.loadMoreText}>Loading more...</Text>}
//           onEndReached={handleLoadMore}
//         />
//       )}
//     </Animated.View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//           <Text style={styles.addButtonLabel}>Add Transaction</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.addCategoryButton} onPress={() => setCategoryModalVisible(true)}>
//           <Text style={styles.addCategoryButtonLabel}>Add Category</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.filterContainer}>
//         <MaterialIcons name="search" size={24} color="black" style={styles.filterIcon} />
//         <TextInput
//           style={styles.filterInput}
//           placeholder="Search by title..."
//           onChangeText={handleFilter}
//           placeholderTextColor="#888888"
//         />
//       </View>

//       {renderLatestTransactionList()}

//       <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Add Transaction</Text>

//             <Picker
//               style={styles.picker}
//               selectedValue={categoryName}
//               onValueChange={(value) => setCategoryName(value)}
//             >
//               <Picker.Item label="Select Category" value="" />
//               <Picker.Item label="Tithe" value="tithe" />
//               <Picker.Item label="Offering" value="offering" />
//               <Picker.Item label="Project" value="project" />
//               <Picker.Item label="Welfare" value="welfare" />
//             </Picker>

//             <Picker
//               style={styles.picker}
//               selectedValue={transactionType}
//               onValueChange={(value) => setTransactionType(value)}
//             >
//               <Picker.Item label="Select Transaction Type" value="" />
//               <Picker.Item label="Income" value="income" />
//               <Picker.Item label="Expense" value="expense" />
//             </Picker>

//             <TextInput
//               style={styles.input}
//               placeholder="Title"
//               value={title}
//               onChangeText={(text) => setTitle(text)}
//             />

//             <TextInput
//               style={styles.textarea}
//               placeholder="Description"
//               value={description}
//               onChangeText={(text) => setDescription(text)}
//               multiline={true}
//               numberOfLines={4}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Amount"
//               value={amount}
//               onChangeText={(text) => setAmount(text)}
//             />

//             <View style={styles.input}>
//               <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisibility(true)}>
//                 <Text style={styles.dateButtonLabel}>Select Date</Text>
//               </TouchableOpacity>
//               {selectedDate && (
//                 <Text style={styles.selectedDateText}>{selectedDate.toLocaleDateString('en-US')}</Text>
//               )}
//               <DateTimePickerModal
//                 isVisible={isDatePickerVisible}
//                 mode="date"
//                 onConfirm={handleDateConfirm}
//                 onCancel={() => setDatePickerVisibility(false)}
//               />
//             </View>

//             <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
//               <Text style={styles.saveButtonLabel}>Save Transaction</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
//               <Text style={styles.cancelButtonLabel}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={categoryModalVisible}
//         onRequestClose={() => setCategoryModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Add Category</Text>

//             {/* Category Name Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Category Name"
//               value={categoryName}
//               onChangeText={(text) => setCategoryName(text)}
//             />

//             {/* Save Category Button */}
//             <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
//               <Text style={styles.saveButtonLabel}>Save Category</Text>
//             </TouchableOpacity>

//             {/* Cancel Button */}
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => {
//                 setCategoryModalVisible(false);
//                 setCategoryName('');
//               }}
//             >
//               <Text style={styles.cancelButtonLabel}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };
import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Modal, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from './../firebase';
import { COLORS, FONTS, SIZES, icons, images } from './../constants';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

const TransactionScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]); // Added missing state

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage] = useState(10);

  const lastVisibleIndex = pageNumber * itemsPerPage;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'transactions'), (snapshot) => {
      const transactions = snapshot.docs.map((doc) => doc.data());
      setLatestTransaction(transactions);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleFilter = (filterText) => {
    if (latestTransaction) {
      const filteredTransactions = latestTransaction.filter((transaction) =>
        transaction.title.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredData(filteredTransactions);
      setPageNumber(1);
    }
  };

  const handleLoadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const transactionTypes = ['income', 'expense'];
  const categoryListHeightAnimationValue = useRef(new Animated.Value(115)).current;

  const saveTransaction = () => {
    const transactionData = {
      categoryName,
      transactionType,
      title,
      description,
      amount,
      date,
      status: 'pending',
    };

    saveTransToFirestore(transactionData);

    setLatestTransaction({ title, description, amount, date });

    setCategoryName('');
    setTransactionType('');
    setTitle('');
    setDescription('');
    setAmount('');
    setDate('');

    setModalVisible(false);
  };

  const saveTransToFirestore = async (transactionData) => {
    try {
      const transactionRef = collection(firestore, 'transactions');
      await addDoc(transactionRef, transactionData);
    } catch (error) {
      console.log('Error saving transaction to Firestore');
    }
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);

    // Format the selected date
    const formattedDate = date.toLocaleDateString('en-US');

    // Set the formatted date in the 'date' state
    setDate(formattedDate);
  };

  const saveCategory = async () => {
    try {
      const categoryData = {
        categoryName: categoryName,
      };

      const categoryRef = collection(firestore, 'categories');
      await addDoc(categoryRef, categoryData);

      setCategoryModalVisible(false);
      setCategoryName('');
    } catch (error) {
      console.error('Error saving category to Firestore:', error);
    }
  };

  const renderLatestTransactionItem = ({ item }) => {
    const { title, description, amount, date } = item;
    let displayedDescription = description;
    let readMoreLink = null;

    // Split the note by spaces to count words
    const words = description.split(' ');

    // Check if the note exceeds 3 words or 20 characters
    if (words.length > 3 || description.length > 20) {
      displayedDescription = words.slice(0, 3).join(' ');
      readMoreLink = '... Read More';
    }

    return (
      <TouchableOpacity
        style={[styles.listItem, { opacity: fadeAnim }]}
        onPress={() => navigation.navigate('ExpenseDetailScreen', { item })}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{date}</Text>
            <Text>
              {displayedDescription}
              {readMoreLink && <Text style={styles.readMoreLink}>{readMoreLink}</Text>}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Text style={styles.titleText}>{amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLatestTransactionList = () => (
    <Animated.View>
      {latestTransaction && (
        <FlatList
          data={latestTransaction.slice(0, lastVisibleIndex)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderLatestTransactionItem}
          contentContainerStyle={styles.flatListContainer}
          ListFooterComponent={<Text style={styles.loadMoreText}>Loading more...</Text>}
          onEndReached={handleLoadMore}
        />
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonLabel}>Add Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addCategoryButton} onPress={() => setCategoryModalVisible(true)}>
          <Text style={styles.addCategoryButtonLabel}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <MaterialIcons name="search" size={24} color="black" style={styles.filterIcon} />
        <TextInput
          style={styles.filterInput}
          placeholder="Search by title..."
          onChangeText={handleFilter}
          placeholderTextColor="#888888"
        />
      </View>

      {renderLatestTransactionList()}

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <Picker
              style={styles.picker}
              selectedValue={categoryName}
              onValueChange={(value) => setCategoryName(value)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Tithe" value="tithe" />
              <Picker.Item label="Offering" value="offering" />
              <Picker.Item label="Project" value="project" />
              <Picker.Item label="Welfare" value="welfare" />
            </Picker>

            <Picker
              style={styles.picker}
              selectedValue={transactionType}
              onValueChange={(value) => setTransactionType(value)}
            >
              <Picker.Item label="Select Transaction Type" value="" />
              <Picker.Item label="Income" value="income" />
              <Picker.Item label="Expense" value="expense" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />

            <TextInput
              style={styles.textarea}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline={true}
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />

            <View style={styles.input}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisible(true)}>
                <Text style={styles.dateButtonLabel}>Select Date</Text>
              </TouchableOpacity>
              {selectedDate && (
                <Text style={styles.selectedDateText}>{selectedDate.toLocaleDateString('en-US')}</Text>
              )}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisible(false)}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
              <Text style={styles.saveButtonLabel}>Save Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Category</Text>

            {/* Category Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={(text) => setCategoryName(text)}
            />

            {/* Save Category Button */}
            <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
              <Text style={styles.saveButtonLabel}>Save Category</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCategoryModalVisible(false);
                setCategoryName('');
              }}
            >
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  addCategoryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    flex: 1,
  },
  addCategoryButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
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
  picker: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textarea: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  dateButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedDateText: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  cancelButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
  },
  imageContainer: {
    marginLeft: 10,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  readMoreLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  loadMoreText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#888888',
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
});

export default TransactionScreen;

//  import {useState, useRef, useEffect } from 'react';
//  import { View, Button, Modal, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Animated } from 'react-native';
//  import { Picker } from '@react-native-picker/picker';
//  import DateTimePickerModal from 'react-native-modal-datetime-picker';
//  import { collection, addDoc, onSnapshot } from 'firebase/firestore';
//  import { firestore } from './../firebase';
//  import { COLORS, FONTS, SIZES, icons, images } from './../constants';
//  import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
//  import { getAuth } from 'firebase/auth';

//  const TransactionScreen = ({ navigation }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//    const [modalVisible, setModalVisible] = useState(false);
//    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
//    const [latestTransaction, setLatestTransaction] = useState(null);
//    const [categoryName, setCategoryName] = useState('');
//    const [transactionType, setTransactionType] = useState('');
//    const [title, setTitle] = useState('');
//    const [description, setDescription] = useState('');
//    const [amount, setAmount] = useState('');
//    const [date, setDate] = useState('');
//    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//    const [selectedDate, setSelectedDate] = useState(null);
 
//    const fadeAnim = useRef(new Animated.Value(0)).current;
//    const [pageNumber, setPageNumber] = useState(1);
//    const [itemsPerPage] = useState(10);
 
//    const lastVisibleIndex = pageNumber * itemsPerPage;
 
//    useEffect(() => {
//      const unsubscribe = onSnapshot(collection(firestore, 'transactions'), (snapshot) => {
//        const transactions = snapshot.docs.map((doc) => doc.data());
//        setLatestTransaction(transactions);
//      });
 
//      // Clean up the subscription when the component unmounts
//      return () => unsubscribe();
//    }, []);
 
//    useEffect(() => {
//      Animated.timing(fadeAnim, {
//        toValue: 1,
//        duration: 500,
//        useNativeDriver: true,
//      }).start();
//    }, [fadeAnim]);
 
//    const handleFilter = (filterText) => {
//      if (latestTransaction) {
//        const filteredTransactions = latestTransaction.filter((transaction) =>
//          transaction.title.toLowerCase().includes(filterText.toLowerCase())
//        );
//        setFilteredData(filteredTransactions);
//        setPageNumber(1);
//      }
//    };
 
//    const handleLoadMore = () => {
//      setPageNumber((prevPageNumber) => prevPageNumber + 1);
//    };
 
//    const transactionTypes = ['income', 'expense'];
//    const categoryListHeightAnimationValue = useRef(new Animated.Value(115)).current;
 
//    const saveTransaction = () => {
//      const transactionData = {
//        categoryName,
//        transactionType,
//        title,
//        description,
//        amount,
//        date,
//      };
 
//      saveTransToFirestore(transactionData);
 
//      setLatestTransaction({ title, description, amount, date });
 
//      setCategoryName('');
//      setTransactionType('');
//      setTitle('');
//      setDescription('');
//      setAmount('');
//      setDate('');
 
//      setModalVisible(false);
//    };
 
//    const saveTransToFirestore = async (transactionData) => {
//      try {
//        const transactionRef = collection(firestore, 'transactions');
//        await addDoc(transactionRef, transactionData);
//      } catch (error) {
//        console.log('Error saving transaction to Firestore');
//      }
//    };
 
//    const handleDateConfirm = (date) => {
//      setSelectedDate(date);
//      setDatePickerVisibility(false);
 
//      // Format the selected date
//      const formattedDate = date.toLocaleDateString('en-US');
 
//      // Set the formatted date in the 'date' state
//      setDate(formattedDate);
//    };
 
//    const saveCategory = async () => {
//      try {
//        const categoryData = {
//          categoryName: categoryName,
//        };
 
//        const categoryRef = collection(firestore, 'categories');
//        await addDoc(categoryRef, categoryData);
 
//        setCategoryModalVisible(false);
//        setCategoryName('');
//      } catch (error) {
//        console.error('Error saving category to Firestore:', error);
//      }
//    };
 
//    const renderLatestTransactionItem = ({ item }) => {
//      const { title, description, amount, date } = item;
//      let displayedDescription = description;
//      let readMoreLink = null;
 
//      // Split the note by spaces to count words
//      const words = description.split(' ');
 
//      // Check if the note exceeds 3 words or 20 characters
//      if (words.length > 3 || description.length > 20) {
//        displayedDescription = words.slice(0, 3).join(' ');
//        readMoreLink = '... Read More';
//      }
 
//      return (
//        <TouchableOpacity
//          style={[styles.listItem, { opacity: fadeAnim }]}
//          onPress={() => navigation.navigate('ExpenseDetailScreen', { item })}
//        >
//          <View style={styles.contentContainer}>
//            <View style={styles.iconContainer}>
//              <MaterialIcons name="account" size={24} color="black" style={styles.icon} />
//            </View>
//            <View style={styles.textContainer}>
//              <Text style={styles.titleText}>{title}</Text>
//              <Text style={styles.dateText}>{date}</Text>
//              <Text>
//                {displayedDescription}
//                {readMoreLink && <Text style={styles.readMoreLink}>{readMoreLink}</Text>}
//              </Text>
//            </View>
//            <View style={styles.imageContainer}>
//              <Text style={styles.titleText}>{amount}</Text>
//            </View>
//          </View>
//        </TouchableOpacity>
//      );
//    };
 
//    const renderLatestTransactionList = () => (
//      <Animated.View>
//        {latestTransaction && (
//          <FlatList
//            data={latestTransaction.slice(0, lastVisibleIndex)}
//            keyExtractor={(item, index) => index.toString()}
//            renderItem={renderLatestTransactionItem}
//            contentContainerStyle={styles.flatListContainer}
//            ListFooterComponent={<Text style={styles.loadMoreText}>Loading more...</Text>}
//            onEndReached={handleLoadMore}
//          />
//        )}
//      </Animated.View>
//    );
 
//    return (
//      <SafeAreaView style={styles.container}>
//        <View style={styles.buttonContainer}>
//          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//            <Text style={styles.addButtonLabel}>Add Transaction</Text>
//          </TouchableOpacity>
 
//          <TouchableOpacity style={styles.addCategoryButton} onPress={() => setCategoryModalVisible(true)}>
//            <Text style={styles.addCategoryButtonLabel}>Add Category</Text>
//          </TouchableOpacity>
//        </View>
 
//        <View style={styles.filterContainer}>
//          <MaterialIcons name="search" size={24} color="black" style={styles.filterIcon} />
//          <TextInput
//            style={styles.filterInput}
//            placeholder="Search by title..."
//            onChangeText={handleFilter}
//            placeholderTextColor="#888888"
//          />
//        </View>
 
//        {renderLatestTransactionList()}
 
//        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//          <View style={styles.modalContainer}>
//            <View style={styles.modalCard}>
//              <Text style={styles.modalTitle}>Add Transaction</Text>
 
//              <Picker
//                style={styles.picker}
//                selectedValue={categoryName}
//                onValueChange={(value) => setCategoryName(value)}
//              >
//                <Picker.Item label="Select Category" value="" />
//                <Picker.Item label="Tithe" value="tithe" />
//                <Picker.Item label="Offering" value="offering" />
//                <Picker.Item label="Project" value="project" />
//                <Picker.Item label="Welfare" value="welfare" />
//              </Picker>
 
//              <Picker
//                style={styles.picker}
//                selectedValue={transactionType}
//                onValueChange={(value) => setTransactionType(value)}
//              >
//                <Picker.Item label="Select Transaction Type" value="" />
//                <Picker.Item label="Income" value="income" />
//                <Picker.Item label="Expense" value="expense" />
//              </Picker>
 
//              <TextInput
//                style={styles.input}
//                placeholder="Title"
//                value={title}
//                onChangeText={(text) => setTitle(text)}
//              />
 
//              <TextInput
//                style={styles.textarea}
//                placeholder="Description"
//                value={description}
//                onChangeText={(text) => setDescription(text)}
//                multiline={true}
//                numberOfLines={4}
//              />
 
//              <TextInput
//                style={styles.input}
//                placeholder="Amount"
//                value={amount}
//                onChangeText={(text) => setAmount(text)}
//              />
 
//              <View style={styles.input}>
//                <TouchableOpacity style={styles.dateButton} onPress={() => setDatePickerVisibility(true)}>
//                  <Text style={styles.dateButtonLabel}>Select Date</Text>
//                </TouchableOpacity>
//                {selectedDate && (
//                  <Text style={styles.selectedDateText}>{selectedDate.toLocaleDateString('en-US')}</Text>
//                )}
//                <DateTimePickerModal
//                  isVisible={isDatePickerVisible}
//                  mode="date"
//                  onConfirm={handleDateConfirm}
//                  onCancel={() => setDatePickerVisibility(false)}
//                />
//              </View>
 
//              <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
//                <Text style={styles.saveButtonLabel}>Save Transaction</Text>
//              </TouchableOpacity>
 
//              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
//                <Text style={styles.cancelButtonLabel}>Cancel</Text>
//              </TouchableOpacity>
//            </View>
//          </View>
//        </Modal>
 
//        <Modal
//          animationType="slide"
//          transparent={true}
//          visible={categoryModalVisible}
//          onRequestClose={() => setCategoryModalVisible(false)}
//        >
//          <View style={styles.modalContainer}>
//            <View style={styles.modalCard}>
//              <Text style={styles.modalTitle}>Add Category</Text>
 
//              {/* Category Name Input */}
//              <TextInput
//                style={styles.input}
//                placeholder="Category Name"
//                value={categoryName}
//                onChangeText={(text) => setCategoryName(text)}
//              />
 
//              {/* Save Category Button */}
//              <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
//                <Text style={styles.saveButtonLabel}>Save Category</Text>
//              </TouchableOpacity>
 
//              {/* Cancel Button */}
//              <TouchableOpacity
//                style={styles.cancelButton}
//                onPress={() => {
//                  setCategoryModalVisible(false);
//                  setCategoryName('');
//                }}
//              >
//                <Text style={styles.cancelButtonLabel}>Cancel</Text>
//              </TouchableOpacity>
//            </View>
//          </View>
//        </Modal>
//      </SafeAreaView>
//    );
//  };
 
//  const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//      padding: 20,
//    },
//    buttonContainer: {
//      flexDirection: 'row',
//      justifyContent: 'space-between',
//      marginBottom: 10,
//    },
//    addButton: {
//      backgroundColor: '#4CAF50',
//      paddingVertical: 12,
//      paddingHorizontal: 16,
//      borderRadius: 5,
//      flex: 1,
//      marginRight: 10,
//    },
//    addButtonLabel: {
//      color: 'white',
//      fontWeight: 'bold',
//      fontSize: 16,
//      textAlign: 'center',
//    },
//    addCategoryButton: {
//      backgroundColor: '#2196F3',
//      paddingVertical: 12,
//      paddingHorizontal: 16,
//      borderRadius: 5,
//      flex: 1,
//    },
//    addCategoryButtonLabel: {
//      color: 'white',
//      fontWeight: 'bold',
//      fontSize: 16,
//      textAlign: 'center',
//    },
//    modalContainer: {
//      flex: 1,
//      justifyContent: 'center',
//      backgroundColor: 'rgba(0, 0, 0, 0.5)',
//    },
//    modalCard: {
//      backgroundColor: 'white',
//      margin: 20,
//      padding: 20,
//      borderRadius: 10,
//    },
//    modalTitle: {
//      fontSize: 18,
//      fontWeight: 'bold',
//      marginBottom: 10,
//    },
//    picker: {
//      marginBottom: 10,
//      height: 40,
//      borderColor: 'gray',
//      borderWidth: 1,
//    },
//    input: {
//      height: 40,
//      borderColor: 'gray',
//      borderWidth: 1,
//      marginBottom: 10,
//      paddingHorizontal: 10,
//      flexDirection: 'row',
//      alignItems: 'center',
//    },
//    textarea: {
//      height: 80,
//      borderColor: 'gray',
//      borderWidth: 1,
//      marginBottom: 10,
//      paddingHorizontal: 10,
//      textAlignVertical: 'top',
//    },
//    dateButton: {
//      backgroundColor: '#2196F3',
//      paddingVertical: 8,
//      paddingHorizontal: 16,
//      borderRadius: 5,
//      marginRight: 10,
//    },
//    dateButtonLabel: {
//      color: 'white',
//      fontWeight: 'bold',
//      fontSize: 16,
//      textAlign: 'center',
//    },
//    selectedDateText: {
//      flex: 1,
//    },
//    saveButton: {
//      backgroundColor: 'green',
//      paddingVertical: 12,
//      paddingHorizontal: 16,
//      borderRadius: 5,
//      marginBottom: 10,
//    },
//    saveButtonLabel: {
//      color: 'white',
//      fontWeight: 'bold',
//      fontSize: 16,
//      textAlign: 'center',
//    },
//    cancelButton: {
//      backgroundColor: 'red',
//      paddingVertical: 12,
//      paddingHorizontal: 16,
//      borderRadius: 5,
//    },
//    cancelButtonLabel: {
//      color: 'white',
//      fontWeight: 'bold',
//      fontSize: 16,
//      textAlign: 'center',
//    },
//    flatListContainer: {
//      paddingBottom: 16,
//    },
//    listItem: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      paddingVertical: 12,
//      paddingHorizontal: 16,
//      borderBottomWidth: 1,
//      borderBottomColor: '#ECECEC',
//      backgroundColor: '#FFFFFF',
//      marginBottom: 8,
//      borderRadius: 8,
//      shadowColor: '#000000',
//      shadowOffset: {
//        width: 0,
//        height: 2,
//      },
//      shadowOpacity: 0.1,
//      shadowRadius: 4,
//      elevation: 2,
//    },
//    contentContainer: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      justifyContent: 'space-between',
//      flex: 1,
//    },
//    iconContainer: {
//      marginRight: 10,
//    },
//    icon: {
//      marginRight: 10,
//    },
//    textContainer: {
//      flex: 1,
//    },
//    titleText: {
//      fontWeight: 'bold',
//      fontSize: 16,
//      marginBottom: 4,
//      color: 'black',
//    },
//    dateText: {
//      fontSize: 14,
//      color: '#888888',
//    },
//    imageContainer: {
//      marginLeft: 10,
//    },
//    image: {
//      width: 40,
//      height: 40,
//      resizeMode: 'contain',
//    },
//    readMoreLink: {
//      color: 'blue',
//      fontWeight: 'bold',
//    },
//    loadMoreText: {
//      textAlign: 'center',
//      marginVertical: 16,
//      color: '#888888',
//    },
//    filterContainer: {
//      flexDirection: 'row',
//      alignItems: 'center',
//      backgroundColor: '#FFFFF4',
//      borderRadius: 8,
//      paddingHorizontal: 12,
//      marginBottom: 16,
//      shadowColor: '#000',
//      shadowOffset: {
//        width: 0,
//        height: 2,
//      },
//      shadowOpacity: 0.1,
//      shadowRadius: 2,
//      elevation: 2,
//    },
//    filterIcon: {
//      marginRight: 8,
//    },
//    filterInput: {
//      flex: 1,
//      color: '#000',
//      fontSize: 16,
//      paddingVertical: 12,
//      fontWeight: 'bold',
//    },
//  });
 
//  export default TransactionScreen;
 

// import React, { useState } from 'react';
// import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const TransactionScreen = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [latestTransaction, setLatestTransaction] = useState(null);
//   const [categoryName, setCategoryName] = useState('');
//   const [transactionType, setTransactionType] = useState('');
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [date, setDate] = useState('');

//   const transactionTypes = ['income', 'expense'];

//   // Function to handle saving the transaction
//   const saveTransaction = () => {
//     // Save the transaction logic goes here

//     // Update the latest transaction state
//     setLatestTransaction({ title, description, amount, date });

//     // Reset the input fields
//     setCategoryName('');
//     setTransactionType('');
//     setTitle('');
//     setDescription('');
//     setAmount('');
//     setDate('');

//     // Reset the modalVisible state
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Button to open the modal */}
//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.addButtonLabel}>Add Transaction</Text>
//       </TouchableOpacity>

//       {/* Latest Transaction */}
//       {latestTransaction && (
//         <View style={styles.latestTransactionContainer}>
//           <Text style={styles.latestTransactionTitle}>Latest Transaction</Text>
//           <Text style={styles.latestTransactionDetails}>
//             Title: {latestTransaction.title}
//           </Text>
//           <Text style={styles.latestTransactionDetails}>
//             Description: {latestTransaction.description}
//           </Text>
//           <Text style={styles.latestTransactionDetails}>
//             Amount: {latestTransaction.amount}
//           </Text>
//           <Text style={styles.latestTransactionDetails}>
//             Date: {latestTransaction.date}
//           </Text>
//         </View>
//       )}

//       {/* Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalCard}>
//             {/* Transaction Form */}
//             <Text style={styles.modalTitle}>Add Transaction</Text>

//             {/* Category Name Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Category Name"
//               value={categoryName}
//               onChangeText={text => setCategoryName(text)}
//             />

//             {/* Transaction Type Picker */}
//             <Picker
//                 selectedValue={transactionType}
//                 onValueChange={(value) => setTransactionType(value)}
//                 >
//                 <Picker.Item label="Select Transaction Type" value="" />
//                 <Picker.Item label="Income" value="income" />
//                 <Picker.Item label="Expense" value="expense" />
//             </Picker>


//             {/* Title Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Title"
//               value={title}
//               onChangeText={text => setTitle(text)}
//             />

//             {/* Description Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Description"
//               value={description}
//               onChangeText={text => setDescription(text)}
//             />

//             {/* Amount Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Amount"
//               value={amount}
//               onChangeText={text => setAmount(text)}
//             />

//             {/* Date Input */}
//             <TextInput
//               style={styles.input}
//               placeholder="Date"
//               value={date}
//               onChangeText={text => setDate(text)}
//             />

//             {/* Save Button */}
//             <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
//               <Text style={styles.saveButtonLabel}>Save Transaction</Text>
//             </TouchableOpacity>

//             {/* Cancel Button */}
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.cancelButtonLabel}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   addButton: {
//     backgroundColor: 'green',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   addButtonLabel: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   latestTransactionContainer: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: 'lightgray',
//     borderRadius: 5,
//   },
//   latestTransactionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   latestTransactionDetails: {
//     marginBottom: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalCard: {
//     backgroundColor: 'white',
//     margin: 20,
//     padding: 20,
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   label: {
//     marginBottom: 5,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   picker: {
//     marginBottom: 10,
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//   },
//   saveButton: {
//     backgroundColor: 'green',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   saveButtonLabel: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   cancelButton: {
//     backgroundColor: 'red',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   cancelButtonLabel: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default TransactionScreen;

