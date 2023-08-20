import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

const NewMemberDetailScreen = ({ navigation, route }) => {
  const { rowData } = route.params; // Extract the rowData from the route params

  const { name, phone,email,address, state, prayerRequest, date } = rowData;


  const handleDone = () => {
    navigation.navigate('Home');
    // setRefreshed(false);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor="#877dfa"
        centerComponent={{ text: 'New Members Detail', style: styles.headerText }}
        leftComponent={
          <TouchableOpacity onPress={handleDone} style={styles.backButtonContainer}>
            <Ionicons name="ios-arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.contentScrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <MaterialIcons name='person' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Name:</Text>
              <Text style={styles.headerText}>{name}</Text>
            </View>
            <View style={styles.headerRow}>
              <Entypo name='old-phone' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Phone:</Text>
              <Text style={styles.headerText}>{phone}</Text>
            </View>
            <View style={styles.headerRow}>
              <Entypo name='calendar' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Date:</Text>
              <Text style={styles.headerDateText}>{date}</Text>
            </View>
            <View style={styles.divider}></View>
          </View>
          <View style={styles.card}>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Email:</Text>
              <Text style={styles.value}>  {email}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Address:</Text>
              <Text style={styles.value}>  {address}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>State:</Text>
              <Text style={styles.value}>  {state}</Text>
            </View>
              <View style={styles.textareaContainer}>
                <View style={styles.sectionContainer}>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.textareaValue}>  {prayerRequest}</Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Country:</Text>
              <Text style={styles.value}>  {rowData.country}</Text>
            </View>  
  
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Tribe:</Text>
              <Text style={styles.value}>  {rowData.tribe}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 20,
  },
  contentScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor:'#CFCCCF',
    marginTop:20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#877dfa',
    marginBottom: 10,
    borderWidth:2,
  },
  headerDateText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
  card: {
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#877dfa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 18,
    color: '#000',
  },
  value: {
    flex: 1,
    fontSize: 18,
    color: '#FFF',
    fontWeight:'bold'
  },
  textareaContainer: {
    marginBottom: 10,
  },
  textareaValue: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    textAlignVertical: 'top',
    fontWeight:'bold'
  },
});

export default NewMemberDetailScreen;

