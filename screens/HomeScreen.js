import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Feather } from '@expo/vector-icons'; 
import SwipeableCard from '../components/SwipableCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { addUser } from '../redux/actions/user';
import { addJournal } from '../redux/actions/journal';
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';

const HomeScreen = ({ navigation, journalsData, addUser, user, addJournal }) => {
  const colors = useTheme().colors;
  const photoURL = user.photoURL
  useEffect( ()=> {
      addUser(auth.currentUser?.displayName, auth.currentUser?.photoURL, "")
  },[])
  
  const renderEmptyView = () => {
    return (
      <View style={styles.emptyContainer}>
        
        <Text style={[styles.emptyTextTop, {color: colors.text}]}>Hey There {user.name}, There's So Much To Write About</Text>
        <Text style={[styles.emptyTextBottom, {color: colors.text}]}>Would You Like To Get Started?</Text>
      </View>
    );
  };

  const handleNavigate = async() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    const userId = user.uid;
    const userJournalCollectionRef = collection(db, `users/${userId}/userProfileData`);
    const bioDocRef = doc(userJournalCollectionRef, 'bio')

  try {
    const bioDocSnapshot =  await getDoc(bioDocRef);

    if (bioDocSnapshot.exists()) {
      const bioData = bioDocSnapshot.data();
    addUser(auth.currentUser?.displayName, auth.currentUser?.photoURL, bioData.bio)
    navigation.navigate('Profile')
    } else {
      addUser(auth.currentUser?.displayName, auth.currentUser?.photoURL, "Add a Bio......")
      navigation.navigate('Profile')
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
   
  }

   useEffect (() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    const userId = user.uid;

    const userJournalCollectionRef = collection(db, `users/${userId}/journals`);

    const q = query(userJournalCollectionRef); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const journalsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        journalsData.push({
          id: doc.id,
          date: data.date,
          title: data.title,
          content: data.content
        });
      });
      journalsData.forEach((journal)=> {
        addJournal(journal.id, journal.date, journal.title, journal.content)
      })
    });

    return () => unsubscribe();
  },[addJournal])


  const renderJournals = () => {
    if (journalsData.length === 0) {
      return renderEmptyView();
    }
    else{
      return (
      <FlatList
        data={journalsData}
        keyExtractor={item => item.id}
        renderItem={({ item,index }) => (
        <GestureHandlerRootView><SwipeableCard item={item}/></GestureHandlerRootView>
        )}
      />
      )
      
        }
    
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>What's On Your Mind?</Text>
        <TouchableOpacity onPress={handleNavigate}>
          <Image
            source={photoURL ? { uri: photoURL } : require('../assets/profile-image.jpg')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      {renderJournals()}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddJournal')}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbfc',
    paddingTop: 30,  
  },
  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  emptyTextTop: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 16,
    width: 270,
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyTextBottom: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    marginBottom: 20,
  },
  header: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: 'GeneralSans-SemiBold',
    fontSize: 34,
    width: 200,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  moreText: {
    fontFamily: 'GeneralSans-SemiBold',
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#8568f0',
    width: 66,
    height: 66,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  journalCard: {
    width: "95%",
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignSelf: 'center'
  },
  journalDate: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 12,
    marginBottom: 8,
    color: '#777',
  },
  journalContent: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    journalsData: state.journalReducer.journalsData,
    user: state.userReducer.user
  };
};

const mapDispatchToProps = { addUser, addJournal };

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);