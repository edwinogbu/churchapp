import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { COLORS, FONTS, SIZES } from './../constants';

const PaymentHistoryItem = ({ item }) => {
  const navigation = useNavigation();

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

const styles = StyleSheet.create({
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
});

export default PaymentHistoryItem;
