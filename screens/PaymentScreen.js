// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// import { COLORS, FONTS, SIZES } from './../constants';
// import { collection, addDoc, setDoc, doc, onSnapshot, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
// import { firestore, auth } from './../firebase';
// import { Paystack } from 'react-native-paystack-webview';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { Ionicons } from '@expo/vector-icons';
// import { ScrollView } from 'react-native-gesture-handler';

// const PaymentScreen = ({navigation}) => {
// //   const navigation = useNavigation();

//   const [paymentType, setPaymentType] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [showPayment, setShowPayment] = useState(true);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const paystackWebViewRef = useRef(null);

//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${month}-${day}-${year}`;

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const unsubscribe = onSnapshot(userDocRef, (doc) => {
//         if (doc.exists()) {
//           const userData = doc.data();
//           setEmail(userData.email);
//           setPhone(userData.phone);
//           setName(userData.name);
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       const querySnapshot = await getDocs(query(collection(firestore, 'payments'), orderBy('timestamp', 'desc')));
//       const payments = querySnapshot.docs.map((doc) => doc.data());
//       setPaymentHistory(payments);
//       setFilteredPaymentHistory(payments);
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//     }
//   };

//   const handlePayment = async () => {
//     if (paymentType === '' || amount === '') {
//       Alert.alert('Error', 'Please fill in all the required fields');
//       return;
//     }

//     try {
//       const user = await getCurrentUser();
//       const userData = user.data();
//       paystackWebViewRef.current.startTransaction();
//     } catch (error) {
//       console.error('Error making payment:', error);
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);

//     navigation.navigate('PaymentReceiptScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'Success', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment made successfully!', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       amount,
//       date: formattedDate,
//       paymentStatus: 'Success', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handlePaymentError = async (error) => {
//     console.log('Payment error:', error);
//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'error', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       amount,
//       date: formattedDate,
//       paymentStatus: 'error', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handlePaymentCancel = async () => {
//     console.log('Payment canceled');
    
//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'canceled', // Set the appropriate payment status here
//     });
//     ToastAndroid.show('Payment canceled.', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       date: formattedDate,
//       paymentStatus: 'canceled', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const getCurrentUser = async () => {
//     const userDocRef = doc(firestore, 'users', 'CURRENT_USER_ID'); // Replace 'CURRENT_USER_ID' with the current user's ID
//     const userDoc = await getDoc(userDocRef);
//     return userDoc;
//   };

//   const handleFilter = () => {
//     const filteredPayments = paymentHistory.filter((payment) =>
//       payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPaymentHistory(filteredPayments);
//   };

//   const renderPaymentHistoryItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.paymentCard}
//         onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
//       >
//         <View style={styles.paymentCardContainer}>
//           <View style={styles.paymentCardLeft}>
//             <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
//             <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
//           </View>
//           <View style={styles.paymentCardRight}>
//             <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(true)}
//         >
//           <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(false)}
//         >
//           <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showPayment ? (
        // <>

        
        // <ScrollView>
        // <View style={styles.paymentContainer}>
        //   <View style={styles.inputContainer}>
        //     <Text style={styles.label}>Payment Type</Text>
        //     <Picker
        //       style={styles.input}
        //       selectedValue={paymentType}
        //       onValueChange={(value) => setPaymentType(value)}
        //     >
        //       <Picker.Item label="Select Payment Type" value="" />
        //       <Picker.Item label="Offering" value="offering" />
        //       <Picker.Item label="Tithe" value="tithe" />
        //       <Picker.Item label="Project" value="project" />
        //       <Picker.Item label="Welfare" value="welfare" />
        //     </Picker>
        //   </View>

        //   <View style={styles.inputContainer}>
        //     <Text style={styles.label}>Amount</Text>
        //     <TextInput
        //       style={styles.input}
        //       placeholder="Enter amount"
        //       value={amount}
        //       onChangeText={(text) => setAmount(text)}
        //       keyboardType="numeric"
        //       placeholderTextColor={COLORS.gray}
        //     />
        //   </View>

        //   <View style={styles.inputContainer}>
        //     <Text style={styles.label}>Description</Text>
        //     <TextInput
        //       style={styles.input}
        //       placeholder="Enter description"
        //       value={description}
        //       onChangeText={(text) => setDescription(text)}
        //       placeholderTextColor={COLORS.gray}
        //     />
        //   </View>

        //   <TouchableOpacity style={styles.paymentButton} onPress={() => paystackWebViewRef.current.startTransaction()}>
        //     <Text style={styles.paymentButtonText}>Make Payment</Text>
        //     <Ionicons name="md-arrow-forward" size={24} color={COLORS.white} style={styles.paymentButtonIcon} />
        //   </TouchableOpacity>

        //   <Paystack
        //     paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
        //     billingPhoneNumber={phone}
        //     billingName={email}
        //     amount={amount}
        //     billingEmail={email}
        //     refNumber={new Date().getTime().toString()}
        //     onCancel={handlePaymentCancel}
        //     onSuccess={handlePaymentSuccess}
        //     onError={handlePaymentError}
        //     autoStart={false}
        //     ref={paystackWebViewRef}
        //     style={styles.paystackWebView}
        //     ButtonText="Pay Now"
        //     showPayButton={true}
        //     showPayOption={true}
        //     channels={['card', 'bank', 'ussd']}
        //     currency="NGN"
        //     activityIndicatorColor={COLORS.primary}
        //     SafeAreaViewContainer={{ marginTop: 25 }}
        //     SafeAreaViewContainerModal={{ marginTop: 25 }}
        //   />
        // </View>
        // </ScrollView>
        // </>
//       ) : (
//         <View style={styles.paymentHistoryContainer}>
//           <View style={styles.filterContainer}>
//             <TextInput
//               style={styles.filterInput}
//               placeholder="Search by payment type..."
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//               onEndEditing={handleFilter}
//               placeholderTextColor={COLORS.gray}
//             />
//             <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
//               <Ionicons name="search" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           {/* <Text style={styles.paymentHistoryTitle}>Payment History</Text> */}

//           <FlatList
//             data={filteredPaymentHistory}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderPaymentHistoryItem}
//             contentContainerStyle={styles.paymentHistoryList}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ToastAndroid } from 'react-native';
// import { COLORS, FONTS, SIZES } from './../constants';
// import {
//   collection,
//   addDoc,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   query,
//   orderBy,
// } from 'firebase/firestore';
// import { firestore, auth } from './../firebase';
// import { Paystack } from 'react-native-paystack-webview';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons } from '@expo/vector-icons';
// import { ScrollView } from 'react-native-gesture-handler';

// const PaymentScreen = ({ navigation }) => {
//   const [paymentType, setPaymentType] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [showPayment, setShowPayment] = useState(true);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const paystackWebViewRef = useRef(null);

//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${month}-${day}-${year}`;

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const unsubscribe = onSnapshot(userDocRef, (doc) => {
//         if (doc.exists()) {
//           const userData = doc.data();
//           setEmail(userData.email);
//           setPhone(userData.phone);
//           setName(userData.name);
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(firestore, 'payments'), orderBy('timestamp', 'desc'))
//       );
//       const payments = querySnapshot.docs.map((doc) => doc.data());
//       setPaymentHistory(payments);
//       setFilteredPaymentHistory(payments);
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//     }
//   };

//   const handlePayment = async () => {
//     if (paymentType === '' || amount === '') {
//       Alert.alert('Error', 'Please fill in all the required fields');
//       return;
//     }

//     try {
//       const user = auth.currentUser;
//       paystackWebViewRef.current.startTransaction();
//     } catch (error) {
//       console.error('Error making payment:', error);
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);

//     navigation.navigate('PaymentReceiptScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'Success', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment made successfully!', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       amount,
//       date: formattedDate,
//       paymentStatus: 'Success', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handlePaymentError = async (error) => {
//     console.log('Payment error:', error);
//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'error', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       amount,
//       date: formattedDate,
//       paymentStatus: 'error', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handlePaymentCancel = async () => {
//     console.log('Payment canceled');

//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'canceled', // Set the appropriate payment status here
//     });
//     ToastAndroid.show('Payment canceled.', ToastAndroid.SHORT);

//     const payDetails = {
//       email,
//       address,
//       phone,
//       name,
//       date: formattedDate,
//       paymentStatus: 'canceled', // Add payment status
//     };

//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), payDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handleFilter = () => {
//     const filteredPayments = paymentHistory.filter((payment) =>
//       payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPaymentHistory(filteredPayments);
//   };

//   const renderPaymentHistoryItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.paymentCard}
//         onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
//       >
//         <View style={styles.paymentCardContainer}>
//           <View style={styles.paymentCardLeft}>
//             <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
//             <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
//           </View>
//           <View style={styles.paymentCardRight}>
//             <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(true)}
//         >
//           <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(false)}
//         >
//           <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showPayment ? (
//         <ScrollView>
//           <View style={styles.paymentContainer}>
                    
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Payment Type</Text>
//                 <Picker
//                 style={styles.input}
//                 selectedValue={paymentType}
//                 onValueChange={(value) => setPaymentType(value)}
//                 >
//                 <Picker.Item label="Select Payment Type" value="" />
//                 <Picker.Item label="Offering" value="offering" />
//                 <Picker.Item label="Tithe" value="tithe" />
//                 <Picker.Item label="Project" value="project" />
//                 <Picker.Item label="Welfare" value="welfare" />
//                 </Picker>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Amount</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChangeText={(text) => setAmount(text)}
//                 keyboardType="numeric"
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Description</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter description"
//                 value={description}
//                 onChangeText={(text) => setDescription(text)}
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             <TouchableOpacity style={styles.paymentButton} onPress={() => paystackWebViewRef.current.startTransaction()}>
//                 <Text style={styles.paymentButtonText}>Make Payment</Text>
//                 <Ionicons name="md-arrow-forward" size={24} color={COLORS.white} style={styles.paymentButtonIcon} />
//             </TouchableOpacity>

//             <Paystack
//                 paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
//                 billingPhoneNumber={phone}
//                 billingName={email}
//                 amount={amount}
//                 billingEmail={email}
//                 refNumber={new Date().getTime().toString()}
//                 onCancel={handlePaymentCancel}
//                 onSuccess={handlePaymentSuccess}
//                 onError={handlePaymentError}
//                 autoStart={false}
//                 ref={paystackWebViewRef}
//                 style={styles.paystackWebView}
//                 ButtonText="Pay Now"
//                 showPayButton={true}
//                 showPayOption={true}
//                 channels={['card', 'bank', 'ussd']}
//                 currency="NGN"
//                 activityIndicatorColor={COLORS.primary}
//                 SafeAreaViewContainer={{ marginTop: 25 }}
//                 SafeAreaViewContainerModal={{ marginTop: 25 }}
//             />

//           </View>
//         </ScrollView>
//       ) : (
//         <View style={styles.paymentHistoryContainer}>
              
//           <View style={styles.filterContainer}>
//             <TextInput
//               style={styles.filterInput}
//               placeholder="Search by payment type..."
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//               onEndEditing={handleFilter}
//               placeholderTextColor={COLORS.gray}
//             />
//             <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
//               <Ionicons name="search" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           {/* <Text style={styles.paymentHistoryTitle}>Payment History</Text> */}

//           <FlatList
//             data={filteredPaymentHistory}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderPaymentHistoryItem}
//             contentContainerStyle={styles.paymentHistoryList}
//             showsVerticalScrollIndicator={false}
//           />

//         </View>
//       )}
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: SIZES.padding,
//     backgroundColor: COLORS.lightGray,
//   },
//   toggleButtonsContainer: {
//     flexDirection: 'row',
//     marginBottom: SIZES.padding,
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     overflow: 'hidden',
//   },
//   toggleButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: SIZES.padding,
//   },
//   activeToggleButton: {
//     backgroundColor: COLORS.primary,
//   },
//   toggleButtonText: {
//     ...FONTS.body2,
//     color: COLORS.primary,
//   },
//   activeToggleButtonText: {
//     color: COLORS.white,
//   },
//   paymentContainer: {
//     backgroundColor: COLORS.white,
//     padding: SIZES.padding,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//   },
//   inputContainer: {
//     marginBottom: SIZES.base,
//   },
//   label: {
//     ...FONTS.body3,
//     marginBottom: 5,
//   },
//   input: {
//     height: 40,
//     borderColor: COLORS.primary,
//     borderWidth: 2,
//     paddingHorizontal: SIZES.padding,
//     borderRadius: SIZES.radius,
//     backgroundColor: COLORS.lightGray2,
//     color: COLORS.black,
//     fontWeight:'bold',
//     fontSize:18,
//   },
//   paymentButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: SIZES.padding,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.base,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   paymentButtonText: {
//     ...FONTS.h3,
//     color: COLORS.white,
//     marginRight: 5,
//   },
//   paymentButtonIcon: {
//     marginLeft: 5,
//   },
//   paymentHistoryContainer: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     padding: SIZES.padding,
//     borderRadius: SIZES.radius,
//   },
//   filterContainer: {
//     marginBottom: SIZES.padding,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filterInput: {
//     flex: 1,
//     height: 40,
//     borderColor: COLORS.gray,
//     borderWidth: 1,
//     paddingHorizontal: SIZES.padding,
//     borderRadius: SIZES.radius,
//     backgroundColor: COLORS.lightGray2,
//     color: COLORS.black,
//     marginRight: 10,
//   },
//   filterButton: {
//     backgroundColor: COLORS.primary,
//     padding: 10,
//     borderRadius: SIZES.radius,
//   },
//   paymentHistoryTitle: {
//     ...FONTS.h2,
//     marginBottom: SIZES.padding,
//   },
//   paymentCard: {
//     backgroundColor: COLORS.white,
//     padding: SIZES.padding,
//     marginBottom: SIZES.base,
//     borderRadius: SIZES.radius,
//     shadowColor: COLORS.black,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   paymentCardContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   paymentCardLeft: {
//     flex: 1,
//   },
//   paymentType: {
//     ...FONTS.h3,
//     color: COLORS.primary,
//   },
//   paymentAmount: {
//     ...FONTS.h3,
//     color: COLORS.darkGray,
//     marginBottom: SIZES.base,
//   },
//   paymentCardRight: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   paymentTimestamp: {
//     ...FONTS.body3,
//     color: COLORS.black,
//   },
//   paymentHistoryList: {
//     backgroundColor: COLORS.primary,
//     // padding: SIZES.padding,
//     // marginBottom: SIZES.base,
//     borderRadius: SIZES.radius,
//     shadowColor: COLORS.black,
//     borderColor:COLORS.secondary,
//     borderWidth:2,
//   },
//   paystackWebView: {
//     flex: 1,
//   },
//   loadingIndicator: {
//     marginVertical: SIZES.padding,
//   },
// });

// export default PaymentScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ToastAndroid, ScrollView } from 'react-native';
// import { COLORS, FONTS, SIZES } from './../constants';
// import {
//   collection,
//   addDoc,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   query,
//   orderBy,
// } from 'firebase/firestore';
// import { firestore, auth } from './../firebase';
// import { Paystack } from 'react-native-paystack-webview';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons } from '@expo/vector-icons';

// const PaymentScreen = ({ navigation }) => {
//   const [paymentType, setPaymentType] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [showPayment, setShowPayment] = useState(true);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
//   const [searchText, setSearchText] = useState('');

//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${month}-${day}-${year}`;

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(firestore, 'payments'), orderBy('timestamp', 'desc'))
//       );
//       const payments = querySnapshot.docs.map((doc) => doc.data());
//       setPaymentHistory(payments);
//       setFilteredPaymentHistory(payments);
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//     }
//   };

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const unsubscribe = onSnapshot(userDocRef, (doc) => {
//         if (doc.exists()) {
//           const userData = doc.data();
//           setEmail(userData.email);
//           setPhone(userData.phone);
//           setName(userData.name);
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   const handlePayment = async () => {
//     if (paymentType === '' || amount === '' || description ===''
    
//     // || email === '' || address === '' || phone === '' || name === ''
//     ) {
//       Alert.alert('Error', 'Please fill in all the required fields');
//       return;
//     }

//     try {
//       const paystackOptions = {
//         email,
//         amount: parseInt(amount) * 100, // Amount in kobo
//         publicKey: 'pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913', // Replace with your Paystack public key
//       };

//       Paystack.showPaymentForm(paystackOptions, async (response) => {
//         // Handle Paystack payment response
//         if (response.status === 'success') {
//           const paymentData = {
//             paymentType,
//             amount,
//             description,
//             timestamp: new Date().toLocaleString(),
//             email,
//             address,
//             phone,
//             name,
//           };

//           await addDoc(collection(firestore, 'payments'), paymentData);
//           fetchPaymentHistory();
//           setShowPayment(false);
//           ToastAndroid.show('Payment made successfully!', ToastAndroid.SHORT);
//         } else {
//           ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);
//         }
//       });
//     } catch (error) {
//       console.error('Error making payment:', error);
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);
//     navigation.navigate('PaymentReceiptScreen', {
//       email,
//       address,
//       phone,
//       name,
//       paymentStatus: 'Success',
//     });
//   };

//   const handlePaymentError = async (error) => {
//     console.log('Payment error:', error);
//     navigation.navigate('PaymentReceiptScreen', {
//       email,
//       address,
//       phone,
//       name,
//       paymentStatus: 'error',
//     });
//   };

//   const handlePaymentCancel = async () => {
//     console.log('Payment canceled');
//     navigation.navigate('PaymentReceiptScreen', {
//       email,
//       address,
//       phone,
//       name,
//       paymentStatus: 'canceled',
//     });
//   };

//   const handleFilter = () => {
//     const filteredPayments = paymentHistory.filter((payment) =>
//       payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPaymentHistory(filteredPayments);
//   };

//   const renderPaymentHistoryItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.paymentCard}
//         onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
//       >
//         <View style={styles.paymentCardContainer}>
//           <View style={styles.paymentCardLeft}>
//             <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
//             <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
//           </View>
//           <View style={styles.paymentCardRight}>
//             <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(true)}
//         >
//           <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(false)}
//         >
//           <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showPayment ? (
//         <ScrollView>
//           <View style={styles.paymentContainer}>
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Payment Type</Text>
//               <Picker
//                 style={styles.input}
//                 selectedValue={paymentType}
//                 onValueChange={(value) => setPaymentType(value)}
//               >
//                 <Picker.Item label="Select Payment Type" value="" />
//                 <Picker.Item label="Offering" value="offering" />
//                 <Picker.Item label="Tithe" value="tithe" />
//                 <Picker.Item label="Project" value="project" />
//                 <Picker.Item label="Welfare" value="welfare" />
//               </Picker>
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Amount</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChangeText={(text) => setAmount(text)}
//                 keyboardType="numeric"
//                 placeholderTextColor={COLORS.gray}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Description</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter description"
//                 value={description}
//                 onChangeText={(text) => setDescription(text)}
//                 placeholderTextColor={COLORS.gray}
//               />
//             </View>

//             <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
//               <Text style={styles.paymentButtonText}>Make Payment</Text>
//               <Ionicons name="md-arrow-forward" size={24} color={COLORS.white} style={styles.paymentButtonIcon} />
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       ) : (
//         <View style={styles.paymentHistoryContainer}>
//           <View style={styles.filterContainer}>
//             <TextInput
//               style={styles.filterInput}
//               placeholder="Search by payment type..."
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//               onEndEditing={handleFilter}
//               placeholderTextColor={COLORS.gray}
//             />
//             <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
//               <Ionicons name="search" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={filteredPaymentHistory}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderPaymentHistoryItem}
//             contentContainerStyle={styles.paymentHistoryList}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ToastAndroid } from 'react-native';
// import { COLORS, FONTS, SIZES } from './../constants';
// // import {
// //   collection,
// //   addDoc,
// //   doc,
// //   getDoc,
// //   getDocs,
// //   query,
// //   orderBy,
// // } from 'firebase/firestore';
// import { collection, addDoc, setDoc, doc, onSnapshot, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// import { firestore, auth } from './../firebase';
// import { Paystack } from 'react-native-paystack-webview';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons } from '@expo/vector-icons';
// import { ScrollView } from 'react-native-gesture-handler';

// const PaymentScreen = ({ navigation }) => {
//   const [paymentType, setPaymentType] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [showPayment, setShowPayment] = useState(true);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const paystackWebViewRef = useRef(null);

//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${month}-${day}-${year}`;

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const userDocRef = doc(firestore, 'users', user.uid);
//       const unsubscribe = onSnapshot(userDocRef, (doc) => {
//         if (doc.exists()) {
//           const userData = doc.data();
//           setEmail(userData.email);
//           setPhone(userData.phone);
//           setName(userData.name);
//         }
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(firestore, 'payments'), orderBy('timestamp', 'desc'))
//       );
//       const payments = querySnapshot.docs.map((doc) => doc.data());
//       setPaymentHistory(payments);
//       setFilteredPaymentHistory(payments);
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//     }
//   };

//   const handlePayment = async () => {
//     if (paymentType === '' || amount === '') {
//       Alert.alert('Error', 'Please fill in all the required fields');
//       return;
//     }

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error('User not authenticated.');
//       }

//       const paystackOptions = {
//         email: email,
//         amount: parseInt(amount) * 100, // Amount in kobo
//         ref: new Date().getTime().toString(), // Unique payment reference
//         publicKey: 'YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your Paystack public key
//       };

//       paystackWebViewRef.current.startTransaction(paystackOptions);
//     } catch (error) {
//       console.error('Error making payment:', error);
//     }
//   };

//   const updatePaymentStatus = async (status) => {
//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error('User not authenticated.');
//       }

//       const paymentData = {
//         paymentType,
//         amount,
//         description,
//         timestamp: new Date().toLocaleString(),
//         email: user.email,
//         userId: user.uid,
//         status: status,
//       };

//       await addDoc(collection(firestore, 'payments'), paymentData);
//       fetchPaymentHistory();
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//     }
//   };

//   const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);

//     navigation.navigate('PaymentReceiptScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'Success',
//     });

//     ToastAndroid.show('Payment made successfully!', ToastAndroid.SHORT);

//     updatePaymentStatus('success');
//   };

//   const handlePaymentError = async (error) => {
//     console.log('Payment error:', error);
//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'error',
//     });

//     ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);

//     updatePaymentStatus('error');
//   };

//   const handlePaymentCancel = async () => {
//     console.log('Payment canceled');

//     navigation.navigate('PaymentDetailScreen', {
//       email: email,
//       address: address,
//       phone: phone,
//       name: name,
//       paymentStatus: 'canceled',
//     });

//     ToastAndroid.show('Payment canceled.', ToastAndroid.SHORT);

//     updatePaymentStatus('canceled');
//   };

//   const handleFilter = () => {
//     const filteredPayments = paymentHistory.filter((payment) =>
//       payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPaymentHistory(filteredPayments);
//   };

//   const renderPaymentHistoryItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.paymentCard}
//         onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
//       >
//         <View style={styles.paymentCardContainer}>
//           <View style={styles.paymentCardLeft}>
//             <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
//             <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
//           </View>
//           <View style={styles.paymentCardRight}>
//             <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(true)}
//         >
//           <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(false)}
//         >
//           <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showPayment ? (
//         <ScrollView>
//           <View style={styles.paymentContainer}>
                    
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Payment Type</Text>
//                 <Picker
//                 style={styles.input}
//                 selectedValue={paymentType}
//                 onValueChange={(value) => setPaymentType(value)}
//                 >
//                 <Picker.Item label="Select Payment Type" value="" />
//                 <Picker.Item label="Offering" value="offering" />
//                 <Picker.Item label="Tithe" value="tithe" />
//                 <Picker.Item label="Project" value="project" />
//                 <Picker.Item label="Welfare" value="welfare" />
//                 </Picker>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Amount</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChangeText={(text) => setAmount(text)}
//                 keyboardType="numeric"
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Description</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter description"
//                 value={description}
//                 onChangeText={(text) => setDescription(text)}
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
//                 <Text style={styles.paymentButtonText}>Make Payment</Text>
//                 <Ionicons name="md-arrow-forward" size={24} color={COLORS.white} style={styles.paymentButtonIcon} />
//             </TouchableOpacity>

//             <Paystack
//                 paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
//                 billingPhoneNumber={phone}
//                 billingName={email}
//                 amount={amount}
//                 billingEmail={email}
//                 refNumber={new Date().getTime().toString()}
//                 onCancel={handlePaymentCancel}
//                 onSuccess={handlePaymentSuccess}
//                 onError={handlePaymentError}
//                 autoStart={false}
//                 ref={paystackWebViewRef}
//                 style={styles.paystackWebView}
//                 ButtonText="Pay Now"
//                 showPayButton={true}
//                 showPayOption={true}
//                 channels={['card', 'bank', 'ussd']}
//                 currency="NGN"
//                 activityIndicatorColor={COLORS.primary}
//                 SafeAreaViewContainer={{ marginTop: 25 }}
//                 SafeAreaViewContainerModal={{ marginTop: 25 }}
//             />

//           </View>
//         </ScrollView>
//       ) : (
//         <View style={styles.paymentHistoryContainer}>
              
//           <View style={styles.filterContainer}>
//             <TextInput
//               style={styles.filterInput}
//               placeholder="Search by payment type..."
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//               onEndEditing={handleFilter}
//               placeholderTextColor={COLORS.gray}
//             />
//             <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
//               <Ionicons name="search" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           {/* <Text style={styles.paymentHistoryTitle}>Payment History</Text> */}

//           <FlatList
//             data={filteredPaymentHistory}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderPaymentHistoryItem}
//             contentContainerStyle={styles.paymentHistoryList}
//             showsVerticalScrollIndicator={false}
//           />

//         </View>
//       )}
//     </View>
//   );
// };



// import React, { useState, useEffect, useRef, useContext } from 'react';

//     import {
//         StyleSheet,
//         Text,
//         TextInput,
//         View,
//         Button,
//         Alert,
//         ScrollView,
//         SafeAreaView,
//         ActivityIndicator,
//         Platform,
//         ToastAndroid,
//         FlatList,
//         Dimensions,
//         TouchableOpacity,
//         KeyboardAvoidingView ,
//       } from 'react-native';
// import { COLORS, FONTS, SIZES } from './../constants';
// import {
//   collection,
//   addDoc,
//   doc,
//   onSnapshot,
//   getDoc,
//   getDocs,
//   query,
//   orderBy,
// } from 'firebase/firestore';
// import { firestore, auth } from './../firebase';
// import { Paystack } from 'react-native-paystack-webview';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons } from '@expo/vector-icons';
// // import { ScrollView } from 'react-native-gesture-handler';
// import { AuthContext } from './AuthContext';



// const PaymentScreen = ({ navigation }) => {
//     const { state: { user },  } = useContext(AuthContext);

//   const [paymentType, setPaymentType] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [name, setName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [description, setDescription] = useState('');
//   const [showPayment, setShowPayment] = useState(true);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const paystackWebViewRef = useRef(null);
//   console.log(user.displayName);
//   console.log(user.name);
//   console.log(user.email);
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const formattedDate = `${month}-${day}-${year}`;


//   const [fetchedUser, setFetchedUser] = useState(null);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userDocRef = doc(firestore, 'users', user.uid || userId || user.userId);
//         const userDocSnap = await getDoc(userDocRef);
//         console.log(userDocSnap);
//         if (userDocSnap.exists()) {
//           const userData = userDocSnap.data();
//           console.log(userData);

//           // Access name and phone properties using dot notation or object destructuring
//           const { name, email, phone } = userData.userDetails; // Object destructuring
//           // or
//           console.log('Name:', name);
//           console.log('Phone:', phone);
//           console.log('Email:', email);

//           // Update the corresponding state variables with the fetched data
//           setEmail(email);
//           setPhone(phone);
//           setName(name);

//           setFetchedUser(userData);
//         }
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     };
    
//     if (user) {
//       fetchUserDetails();
//     }
//   }, [user]);



// //   useEffect(() => {
// //     const user = auth.currentUser;
// //     if (user) {
// //       const userDocRef = doc(firestore, 'users', user.uid);
// //       const unsubscribe = onSnapshot(userDocRef, (doc) => {
// //         if (doc.exists()) {
// //           const userData = doc.data();
// //           setEmail(userData.userDetails.email || userData.email);
// //           setPhone(userData.phoneNumber);
// //           setName(userData.name);
// //         }
// //       });
// //       console.log(user.phone);
// //       console.log(user.name);
// //       console.log(user.email);
// //       return () => unsubscribe();
// //     }
// //   }, []);

//   useEffect(() => {
//     fetchPaymentHistory();
//   }, []);

//   const fetchPaymentHistory = async () => {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(firestore, 'payments'), orderBy('timestamp', 'desc'))
//       );
//       const payments = querySnapshot.docs.map((doc) => doc.data());
//       setPaymentHistory(payments);
//       setFilteredPaymentHistory(payments);
//     } catch (error) {
//       console.error('Error fetching payment history:', error);
//     }
//   };

// //   const updatePaymentStatus = async (status) => {
// //     try {
// //       const user = auth.currentUser;
// //       if (!user) {
// //         throw new Error('User not authenticated.');
// //       }

// //       const paymentData = {
// //         paymentType,
// //         amount,
// //         description,
// //         timestamp: new Date().toLocaleString(),
// //         email: user.email,
// //         userId: user.uid,
// //         status: status,
// //       };

// //       await addDoc(collection(firestore, 'payments'), paymentData);
// //       fetchPaymentHistory();
// //     } catch (error) {
// //       console.error('Error updating payment status:', error);
// //     }
// //   };

// //   const handlePaymentSuccess = async (response) => {
// //     console.log('Payment successful:', response);

// //     navigation.navigate('PaymentReceiptScreen', {
// //       email: email,
// //       address: address,
// //       phone: phone,
// //       name: name,
// //       paymentStatus: 'Success',
// //     });

// //     ToastAndroid.show('Payment made successfully!', ToastAndroid.SHORT);

// //     updatePaymentStatus('success');
// //   };

// //   const handlePaymentError = async (error) => {
// //     console.log('Payment error:', error);
// //     navigation.navigate('PaymentDetailScreen', {
// //       email: email,
// //       address: address,
// //       phone: phone,
// //       name: name,
// //       paymentStatus: 'error',
// //     });

// //     ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);

// //     updatePaymentStatus('error');
// //   };

// //   const handlePaymentCancel = async () => {
// //     console.log('Payment canceled');

// //     navigation.navigate('PaymentDetailScreen', {
// //       email: email,
// //       address: address,
// //       phone: phone,
// //       name: name,
// //       paymentStatus: 'canceled',
// //     });

// //     ToastAndroid.show('Payment canceled.', ToastAndroid.SHORT);

// //     updatePaymentStatus('canceled');
// //   };


// const handlePaymentSuccess = async (response) => {
//     console.log('Payment successful:', response);
   
//     navigation.navigate('PaymentReceiptScreen', {
//       email: (user && user.email || email | fetchedUser.email) ,
//       phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//       amount: amount,
//       paymentStatus: 'Success', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment successful!', ToastAndroid.SHORT);
  
//     const paymentDetails = {
//     name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//     email: (user && user.email || email | fetchedUser.email) ,
//     phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       amount: amount,
//       date: formattedDate,
//       paymentStatus: 'success', // Add payment status
//     };
  
//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };
  
//   const handlePaymentError = async (error) => {
//     console.log('Payment error:', error);
//     navigation.navigate('PaymentReceiptScreen', {
//       name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//       email: (user && user.email || email | fetchedUser.email) ,
//       phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       amount: amount,
//       paymentStatus: 'error', // Set the appropriate payment status here
//     });

//     ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);
  
//     const paymentDetails = {
//         name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//         email: (user && user.email || email | fetchedUser.email) ,
//         phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       amount: amount,
//       date: formattedDate,
//       paymentStatus: 'error', // Add payment status
//     };
  
//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };
  
//   const handlePaymentCancel = async () => {
//     console.log('Payment cancelled');
  
//     navigation.navigate('PaymentReceiptScreen', {
//         name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//         email: (user && user.email || email | fetchedUser.email) ,
//         phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       amount: amount,
//       paymentStatus: 'cancelled', // Set the appropriate payment status here
//     });
//     ToastAndroid.show('Payment cancelled.', ToastAndroid.SHORT);
  
//     const paymentDetails = {
//         name: (user && user.name || user.displayName || name || fetchedUser.name) ,
//         email: (user && user.email || email | fetchedUser.email) ,
//         phone: (user && user.phone || user.phoneNumber || phone || fetchedUser.phone) ,
//       amount: amount,
//       date:formattedDate,
//       paymentStatus: 'cancelled', // Add payment status
//     };
  
//     try {
//       const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
//       console.log('payment details saved with ID:', docRef.id);
//     } catch (error) {
//       console.error('Error saving payment details:', error);
//     }
//   };

//   const handleFilter = () => {
//     const filteredPayments = paymentHistory.filter((payment) =>
//       payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
//     );
//     setFilteredPaymentHistory(filteredPayments);
//   };


//   const handlePayment = async () => {
//     if (paymentType === '' || amount === '') {
//       Alert.alert('Error', 'Please fill in all the required fields');
//       return;
//     }

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         throw new Error('User not authenticated.');
//       }

//       paystackWebViewRef.current.startTransaction();
//     } catch (error) {
//       console.error('Error making payment:', error);
//     }
//   };






//   const renderPaymentHistoryItem = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={styles.paymentCard}
//         onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
//       >
//         <View style={styles.paymentCardContainer}>
//           <View style={styles.paymentCardLeft}>
//             <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
//             <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
//           </View>
//           <View style={styles.paymentCardRight}>
//             <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleButtonsContainer}>
//         <TouchableOpacity
//           style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(true)}
//         >
//           <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
//           onPress={() => setShowPayment(false)}
//         >
//           <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
//             Payment History
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showPayment ? (
//         <ScrollView>
//           <View style={styles.paymentContainer}>
                    
//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Payment Type</Text>
//                 <Picker
//                 style={styles.input}
//                 selectedValue={paymentType}
//                 onValueChange={(value) => setPaymentType(value)}
//                 >
//                 <Picker.Item label="Select Payment Type" value="" />
//                 <Picker.Item label="Offering" value="offering" />
//                 <Picker.Item label="Tithe" value="tithe" />
//                 <Picker.Item label="Project" value="project" />
//                 <Picker.Item label="Welfare" value="welfare" />
//                 </Picker>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Amount</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChangeText={(text) => setAmount(text)}
//                 keyboardType="numeric"
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Description</Text>
//                 <TextInput
//                 style={styles.input}
//                 placeholder="Enter description"
//                 value={description}
//                 onChangeText={(text) => setDescription(text)}
//                 placeholderTextColor={COLORS.gray}
//                 />
//             </View>

//             {/* <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
//                 <Text style={styles.paymentButtonText}>Make Payment</Text>
//                 <Ionicons name="md-arrow-forward" size={24} color={COLORS.white} style={styles.paymentButtonIcon} />
//             </TouchableOpacity>
//             <Paystack
//                 paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
//                 billingPhoneNumber={phone}
//                 billingName={email}
//                 amount={amount}
//                 billingEmail={email}
//                 refNumber={new Date().getTime().toString()}
//                 onCancel={handlePaymentCancel}
//                 onSuccess={handlePaymentSuccess}
//                 onError={handlePaymentError}
//                 autoStart={false}
//                 ref={paystackWebViewRef}
//                 style={styles.paystackWebView}
//                 ButtonText="Pay Now"
//                 showPayButton={true}
//                 showPayOption={true}
//                 channels={['card', 'bank', 'ussd']}
//                 currency="NGN"
//                 activityIndicatorColor={COLORS.primary}
//                 SafeAreaViewContainer={{ marginTop: 25 }}
//                 SafeAreaViewContainerModal={{ marginTop: 25 }}
//             /> */}

//             <View style={styles.buttonContainer}>
//       <TouchableOpacity
//         style={styles.paymentButton}
//         onPress={() => paystackWebViewRef.current.startTransaction()}
//         disabled={isLoading}
//       >
//         <Text style={styles.paymentButtonText}>Pay Now</Text>
//       </TouchableOpacity>
//       {/* {isLoading && (
//         <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
//       )} */}
//     </View>

//     <Paystack
//       paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
//       billingPhoneNumber={user && user.phone || user.phoneNumber || phone || fetchedUser.phone}
//       billingName={user && user.name || user.displayName || name || fetchedUser.name}
//       amount={amount}
//       billingEmail={user && user.email || email | fetchedUser.email}
//       refNumber={new Date().getTime().toString()}
//       onCancel={handlePaymentCancel}
//       onSuccess={handlePaymentSuccess}
//       onError={handlePaymentError}
//       autoStart={false}
//       ref={paystackWebViewRef}
//       style={styles.loadingIndicator}
//       ButtonText="Pay Now"
//       showPayButton={true}
//       showPayOption={true}
//       channels={['card', 'bank', 'ussd']}
//       currency="NGN"
//       activityIndicatorColor="green"
//       SafeAreaViewContainer={{ marginTop: 25 }}
//       SafeAreaViewContainerModal={{ marginTop: 25 }}
//     />
//           {isLoading && (
//               <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />
//             )}
//           </View>
//         </ScrollView>
//       ) : (
        
//         <View style={styles.paymentHistoryContainer}>
              
//           <View style={styles.filterContainer}>
//             <TextInput
//               style={styles.filterInput}
//               placeholder="Search by payment type..."
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//               onEndEditing={handleFilter}
//               placeholderTextColor={COLORS.gray}
//             />
//             <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
//               <Ionicons name="search" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           {/* <Text style={styles.paymentHistoryTitle}>Payment History</Text> */}

//           <FlatList
//             data={filteredPaymentHistory}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderPaymentHistoryItem}
//             contentContainerStyle={styles.paymentHistoryList}
//             showsVerticalScrollIndicator={false}
//           />

//         </View>
//       )}
//     </View>
//   );
// };

import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  FlatList,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, FONTS, SIZES } from './../constants';
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { firestore, auth } from './../firebase';
import { Paystack } from 'react-native-paystack-webview';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from './AuthContext';

const PaymentScreen = ({ navigation }) => {
  const { state: { user } } = useContext(AuthContext);

  const [paymentType, setPaymentType] = useState('');
  const [email, setEmail] = useState('');
  // const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  // const [description, setDescription] = useState('');
  const [showPayment, setShowPayment] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const paystackWebViewRef = useRef(null);
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}-${year}`;

  const [fetchedUser, setFetchedUser] = useState(null);
  const [isFetchingUserDetails, setIsFetchingUserDetails] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid || user.userId);
        const userDocSnap = await getDoc(userDocRef);
        console.log(userDocSnap);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log(userData);

          // Access name and phone properties using dot notation or object destructuring
          const { name, email, phone } = userData?.userDetails || {};
          // Update the corresponding state variables with the fetched data
          setEmail(email);
          setPhone(phone);
          setName(name);

          setFetchedUser(userData);
          
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsFetchingUserDetails(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, 'payments'), orderBy('formattedDate', 'asc'))
      );
      const payments = querySnapshot.docs.map((doc) => doc.data());
      setPaymentHistory(payments);
      setFilteredPaymentHistory(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const handleFilter = () => {
    const filteredPayments = paymentHistory.filter((payment) =>
      payment.paymentType.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPaymentHistory(filteredPayments);
  };

  const handlePaymentSuccess = async (response) => {
    console.log('Payment successful:', response);

    navigation.navigate('PaymentReceiptScreen', {
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      amount: amount,
      paymentStatus: 'Success',
    });

    ToastAndroid.show('Payment successful!', ToastAndroid.SHORT);

    const paymentDetails = {
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      amount: amount,
      date: formattedDate,
      paymentStatus: 'success',

    };

    try {
      const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
      console.log('payment details saved with ID:', docRef.id);
      setPaymentType('');
      setAmount('');
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handlePaymentError = async (error) => {
    console.log('Payment error:', error);
    navigation.navigate('PaymentReceiptScreen', {
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      amount: amount,
      paymentStatus: 'error',
    });

    ToastAndroid.show('Payment failed. Please try again.', ToastAndroid.SHORT);

    const paymentDetails = {
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      amount: amount,
      date: formattedDate,
      paymentStatus: 'error',
    };

    try {
      const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
      console.log('payment details saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handlePaymentCancel = async () => {
    console.log('Payment cancelled');

    navigation.navigate('PaymentReceiptScreen', {
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      amount: amount,
      paymentStatus: 'cancelled',
    });

    ToastAndroid.show('Payment cancelled.', ToastAndroid.SHORT);

    const paymentDetails = {
      name: user?.name || user?.displayName || name || fetchedUser?.name,
      email: user?.email || email || fetchedUser?.email,
      phone: user?.phone || user?.phoneNumber || phone || fetchedUser?.phone,
      amount: amount,
      date: formattedDate,
      paymentStatus: 'cancelled',
    };

    try {
      const docRef = await addDoc(collection(firestore, 'payments'), paymentDetails);
      console.log('payment details saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const handlePayment = async () => {
    if (paymentType === '' || amount === '') {
      Alert.alert('Error', 'Please fill in all the required fields');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated.');
      }

      paystackWebViewRef.current.startTransaction();
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const renderPaymentHistoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.paymentCard}
        onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
      >
        <View style={styles.paymentCardContainer}>
          <View style={styles.paymentCardLeft}>
            <Text style={styles.paymentType}>{`${item.paymentType}`}</Text>
            <Text style={styles.paymentAmount}>&#8358;{`${item.amount}`}</Text>
          </View>
          <View style={styles.paymentCardRight}>
            <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleButtonsContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, showPayment ? styles.activeToggleButton : null]}
          onPress={() => setShowPayment(true)}
        >
          <Text style={[styles.toggleButtonText, showPayment ? styles.activeToggleButtonText : null]}>Make Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !showPayment ? styles.activeToggleButton : null]}
          onPress={() => setShowPayment(false)}
        >
          <Text style={[styles.toggleButtonText, !showPayment ? styles.activeToggleButtonText : null]}>
            Payment History
          </Text>
        </TouchableOpacity>
      </View>

      {showPayment ? (
        <ScrollView>
          {isFetchingUserDetails ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={styles.paymentContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Payment Type</Text>
                <Picker
                  style={styles.input}
                  selectedValue={paymentType}
                  onValueChange={(value) => setPaymentType(value)}
                >
                  <Picker.Item label="Select Payment Type" value="" />
                  <Picker.Item label="Offering" value="offering" />
                  <Picker.Item label="Tithe" value="tithe" />
                  <Picker.Item label="Project" value="project" />
                  <Picker.Item label="Welfare" value="welfare" />
                </Picker>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.gray}
                />
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter description"
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  placeholderTextColor={COLORS.gray}
                />
              </View> */}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.paymentButton}
                  onPress={() => handlePayment()}
                  disabled={isLoading}
                >
                  <Text style={styles.paymentButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>

              <Paystack
                paystackKey="pk_test_b3950366e577a3bdbd3a9c7cb88622449de37913"
                billingPhoneNumber={user?.phone || user?.phoneNumber || phone || fetchedUser?.phone}
                billingName={user?.name || user?.displayName || name || fetchedUser?.name}
                amount={amount}
                billingEmail={user?.email || email || fetchedUser?.email}
                refNumber={new Date().getTime().toString()}
                onCancel={handlePaymentCancel}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                autoStart={false}
                ref={paystackWebViewRef}
                style={styles.loadingIndicator}
                ButtonText="Pay Now"
                showPayButton={true}
                showPayOption={true}
                channels={['card', 'bank', 'ussd']}
                currency="NGN"
                activityIndicatorColor="green"
                SafeAreaViewContainer={{ marginTop: 25 }}
                SafeAreaViewContainerModal={{ marginTop: 25 }}
              />
              {isLoading && <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />}
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.paymentHistoryContainer}>
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.filterInput}
              placeholder="Search by payment type..."
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              onEndEditing={handleFilter}
              placeholderTextColor={COLORS.gray}
            />
            <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
              <Ionicons name="search" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredPaymentHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPaymentHistoryItem}
            contentContainerStyle={styles.paymentHistoryList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: SIZES.padding,
      backgroundColor: COLORS.lightGray,
    },
    toggleButtonsContainer: {
      flexDirection: 'row',
      marginBottom: SIZES.padding,
      backgroundColor: COLORS.white,
      borderRadius: SIZES.radius,
      overflow: 'hidden',
    },
    toggleButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.padding,
    },
    activeToggleButton: {
      backgroundColor: COLORS.primary,
    },
    toggleButtonText: {
      ...FONTS.body2,
      color: COLORS.primary,
    },
    activeToggleButtonText: {
      color: COLORS.white,
    },
    paymentContainer: {
      backgroundColor: COLORS.white,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.padding,
    },
    inputContainer: {
      marginBottom: SIZES.base,
    },
    label: {
      ...FONTS.body3,
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: COLORS.primary,
      borderWidth: 2,
      paddingHorizontal: SIZES.padding,
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.lightGray2,
      color: COLORS.black,
      fontWeight:'bold',
      fontSize:18,
    },
    paymentButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SIZES.padding,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.base,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paymentButtonText: {
      ...FONTS.h3,
      color: COLORS.white,
      marginRight: 5,
    },
    paymentButtonIcon: {
      marginLeft: 5,
    },
    paymentHistoryContainer: {
      flex: 1,
      backgroundColor: COLORS.primary,
      padding: SIZES.padding,
      borderRadius: SIZES.radius,
    },
    filterContainer: {
      marginBottom: SIZES.padding,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterInput: {
      flex: 1,
      height: 40,
      borderColor: COLORS.gray,
      borderWidth: 1,
      paddingHorizontal: SIZES.padding,
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.lightGray2,
      color: COLORS.black,
      marginRight: 10,
    },
    filterButton: {
      backgroundColor: COLORS.primary,
      padding: 10,
      borderRadius: SIZES.radius,
    },
    paymentHistoryTitle: {
      ...FONTS.h2,
      marginBottom: SIZES.padding,
    },
    paymentCard: {
      backgroundColor: COLORS.white,
      padding: SIZES.padding,
      marginBottom: SIZES.base,
      borderRadius: SIZES.radius,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    paymentCardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentCardLeft: {
      flex: 1,
    },
    paymentType: {
      ...FONTS.h3,
      color: COLORS.primary,
    },
    paymentAmount: {
      ...FONTS.h3,
      color: COLORS.darkGray,
      marginBottom: SIZES.base,
    },
    paymentCardRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    paymentTimestamp: {
      ...FONTS.body3,
      color: COLORS.black,
    },
    paymentHistoryList: {
      backgroundColor: COLORS.primary,
      padding: SIZES.padding,
      // marginBottom: SIZES.base,
      borderRadius:10,
      // shadowColor: COLORS.black,
      // borderColor:COLORS.secondary,
      // borderWidth:2,
    },
    paystackWebView: {
      flex: 1,
    },
    loadingIndicator: {
      marginVertical: SIZES.padding,
    },
  });
export default PaymentScreen;
