import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from './../firebase';
import { Paystack } from 'react-native-paystack-webview';

import { COLORS, FONTS, SIZES } from './../constants';

const PaymentForm = ({ fetchPaymentHistory }) => {
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState('');
  // const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (paymentType === '' || amount === '') {
      Alert.alert('Error', 'Please fill in all the required fields');
      return;
    }

    setIsLoading(true);

    try {
      const paystackOptions = {
        // Configure Paystack options
      };

      Paystack.showPaymentForm(paystackOptions, async (response) => {
        if (response.status === 'success') {
          const paymentData = {
            paymentType,
            amount,
            // description,
            timestamp: new Date().toLocaleString(),
            // Add other payment data as needed
          };

          await addDoc(collection(firestore, 'payments'), paymentData);
          fetchPaymentHistory();
        }
      });
    } catch (error) {
      console.error('Error making payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Payment Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter payment type"
          value={paymentType}
          onChangeText={(text) => setPaymentType(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />
      </View>

      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View> */}

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="small" color={COLORS.primary} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderColor: COLORS.gray,
    borderWidth: 1,
    paddingHorizontal: SIZES.padding,
  },
  paymentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
  },
  paymentButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default PaymentForm;
