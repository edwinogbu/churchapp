import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

const ExpenseDetailScreen = ({ navigation, route }) => {
  const { item } = route.params;

  const handleDone = () => {
    navigation.navigate('Home');
    // setRefreshed(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor="#877dfa"
        centerComponent={{ text: 'Transaction Detail', style: styles.headerText }}
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
              <Text style={styles.headerText}> Transaction Made By: Eddy</Text>
            </View>
            <View style={styles.headerRow}>
              <MaterialIcons name='update' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Status: Approved</Text>
            </View>
            <View style={styles.headerRow}>
            <Entypo name='calendar' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Transaction Time:</Text>
            </View>
            <View style={styles.headerRow}>
            <Entypo name='old-phone' size={24} color="black" style={styles.icon} />
              <Text style={styles.headerText}> Date:</Text>
              <Text style={styles.headerDateText}>{item.date}</Text>
            </View>
            <View style={styles.divider}></View>
          </View>
          <View style={styles.card}>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Title:</Text>
              <Text style={styles.value}>{item.title}</Text>
            </View>
              <View style={styles.textareaContainer}>
                <View style={styles.sectionContainer}>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.textareaValue}>{item.description}</Text>
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Amount:</Text>
              <Text style={styles.value}>{item.amount}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.title}>Date:</Text>
              <Text style={styles.value}>{item.date}</Text>
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

export default ExpenseDetailScreen;


// import React from 'react';
// import { View, Text, StyleSheet, Image,TouchableOpacity, SafeAreaView, ScrollView  } from 'react-native';
// import { Header } from 'react-native-elements';
// import { MaterialIcons,Ionicons, Entypo } from '@expo/vector-icons';

// const ExpenseDetailScreen = ({navigation, route }) => {
//  const { item } = route.params;


//   const handleDone = () => {
//     navigation.navigate('Home');
//     // setRefreshed(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header
//         backgroundColor="#00048D"
//         centerComponent={{ text: 'Notice Board Detail', style: { color: '#FFFFFF' } }}
//           leftComponent={
//             <TouchableOpacity onPress={handleDone} style={{}}>
//               <Ionicons name="ios-arrow-back" size={14} color="#fff" />
//               <Text style={{ color: '#fff', marginLeft: 20, fontSize: 12 }}>Back</Text>
//             </TouchableOpacity>
//           }    
//       />
//     <ScrollView contentContainerStyle={styles.contentScrollContainer}>


//       <View style={styles.contentContainer}>
//         <View style={styles.card}>
//           <View style={styles.header}>
//             <MaterialIcons name='account' size={24} color="black" style={styles.icon} />
            
//             <Text style={styles.postedByText}>Posted by: Eddy</Text>
//             <Text style={styles.approvedByText}>Approved by: Pastor Ben</Text>
//             <Text style={styles.timeText}>Time of Transaction: {item.date}</Text>
//           </View>
//           <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Title:</Text>
//         <Text style={styles.value}>{item.title}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Description:</Text>
//         <Text style={styles.value}>{item.description}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Amount:</Text>
//         <Text style={styles.value}>{item.amount}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Date:</Text>
//         <Text style={styles.value}>{item.date}</Text>
//       </View>
//         </View>
//       </View>
//     </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   contentScrollContainer: {
//     flexGrow: 1,
//     alignItems: 'center',
//     paddingTop: 10,
//     paddingBottom: 40,
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 16,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     color: 'black',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   date: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   note: {
//     fontSize: 14,
//   },

//   headerContainer: {
//     marginBottom: 20,
//   },
//   postedByText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   approvedByText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },

//   value: {
//     flex: 1,
//     fontSize: 16,
//   },
// });

// export default ExpenseDetailScreen;


// import React from 'react';
// import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

// const ExpenseDetailScreen = ({ route }) => {
//   const { item } = route.params;

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.postedByText}>Posted by: Eddy</Text>
//         <Text style={styles.approvedByText}>Approved by: Pastor Ben</Text>
//         <Text style={styles.timeText}>Time of Transaction: {item.date}</Text>
//       </View>

//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Title:</Text>
//         <Text style={styles.value}>{item.title}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Description:</Text>
//         <Text style={styles.value}>{item.description}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Amount:</Text>
//         <Text style={styles.value}>{item.amount}</Text>
//       </View>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Date:</Text>
//         <Text style={styles.value}>{item.date}</Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   headerContainer: {
//     marginBottom: 20,
//   },
//   postedByText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   approvedByText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   title: {
//     fontWeight: 'bold',
//     marginRight: 5,
//     fontSize: 16,
//   },
//   value: {
//     flex: 1,
//     fontSize: 16,
//   },
// });

// export default ExpenseDetailScreen;
