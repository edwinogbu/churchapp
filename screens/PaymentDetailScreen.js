import React from 'react';
import { View, Text, TouchableOpacity, Share, StyleSheet } from 'react-native';

export default function PaymentDetailScreen({ route, navigation }) {
  const { email, name, address, phone, amount, paymentStatus } = route.params;

  const handleShare = async () => {
    try {
      const receiptText = `Email: ${email}\nAddress: ${address}\nPhone: ${phone}\nTotal Amount: ${amount}\nPayment Status: ${paymentStatus}\n`;
      await Share.share({
        message: receiptText,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Customer Receipt</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>User Details:</Text>
        <Text>Email: {email}</Text>
        <Text>Address: {address}</Text>
        <Text>Phone: {phone}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Amount paid:</Text>
      
          <View key={index} style={styles.itemContainer}>
            <Text style={{fontWeight:'900'}}>{amount}</Text>
          </View>
      
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Payment Status: {paymentStatus}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailTitle}>Total Amount: &#8358;{amount}</Text>
      </View>

      {/* Share button */}
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
          <Text style={{...styles.shareButtonText, margin:20,}}>Finished</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    fontWeight: 'bold',
    justifyContent: 'space-evenly',
    marginBottom: 5,
  },
  shareButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  shareButtonText: {
    backgroundColor: '#2B60DA',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
});
