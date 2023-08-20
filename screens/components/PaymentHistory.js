import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, query, collection, orderBy } from 'firebase/firestore';
import { firestore } from './../firebase';

import { COLORS, FONTS, SIZES } from './../constants';

const PaymentHistory = () => {
  const navigation = useNavigation();

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredPaymentHistory, setFilteredPaymentHistory] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(firestore, 'payments'), orderBy('timestamp', 'desc')));
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

  const renderPaymentHistoryItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.paymentCard}
        onPress={() => navigation.navigate('PaymentDetailScreen', { payment: item })}
      >
        <View style={styles.paymentCardContainer}>
          <View style={styles.paymentCardLeft}>
            <Text style={styles.paymentType}>{item.paymentType}</Text>
            <Text style={styles.paymentAmount}>{`$${item.amount}`}</Text>
          </View>
          <View style={styles.paymentCardRight}>
            <Text style={styles.paymentTimestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.paymentHistoryContainer}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Search by payment type..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onEndEditing={handleFilter}
        />
      </View>

      <Text style={styles.paymentHistoryTitle}>Payment History</Text>

      <FlatList
        data={filteredPaymentHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPaymentHistoryItem}
        contentContainerStyle={styles.paymentHistoryList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paymentHistoryContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  filterContainer: {
    marginBottom: SIZES.padding,
  },
  filterInput: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    paddingHorizontal: SIZES.padding,
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
    ...FONTS.body4,
    color: COLORS.gray,
  },
  paymentHistoryList: {},
});

export default PaymentHistory;
