import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler, Swipeable, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import { deleteJournal } from '../redux/actions/journal';
import { connect } from 'react-redux';
import { useNavigation, useTheme } from '@react-navigation/native';
import { TouchableWithoutFeedbackBase } from 'react-native';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const SwipeableCard = ({ item, deleteJournal}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  
  const navigation = useNavigation()
  const colors = useTheme().colors

  const handleDelete = async (id) => {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }
      const userId = user.uid;
      try {
      
        const userJournalCollectionRef =  doc(db, 'users', userId, 'journals', id);
  
        await deleteDoc(userJournalCollectionRef);
        deleteJournal(id);
      }catch(e) {
        console.log(e)
      }
    
  };


    const renderRightActions = () => {
      
      return (
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          paddingTop: 0,
        }}
        onPress={() => setShowConfirmation(true)}>

          <Animated.View
            style={{
              backgroundColor: '#fc1e1e',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              borderRadius: 30,
            }}>
            <AntDesign name="delete" size={24} color="white" />
          </Animated.View>
        </TouchableOpacity>
      );
    };

   
  
    return (
      <>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}>
        <View style={[styles.journalCard, {backgroundColor: colors.background, borderColor: colors.border}]}>
            <Text style={[styles.journalDate, {color: colors.text}]}>{item.date}</Text>
            <Text style={[styles.journalContent, {color: colors.text}]} numberOfLines={8}>{item.content}   <Text style={styles.moreText} onPress={() => { navigation.navigate('ViewJournal' , {id : item.id})}}>View more</Text></Text>
          </View>
      </Swipeable>
      {showConfirmation && (
        <View style={styles.confirmationPopup}>
          <Text style={styles.confirmationText}>Are you sure you want to delete?</Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.confirmationButton}>
              <Text style={styles.confirmationButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowConfirmation(false)} style={styles.confirmationButton}>
              <Text style={styles.confirmationButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </>
    );
  };

  const styles = StyleSheet.create({
    journalCard: {
      width: "95%",
      marginBottom: 20,
      padding: 16,
      borderRadius: 10,
      borderWidth: 1,
      alignSelf: 'center',
      backgroundColor: '#fcfbfc'
    },
    journalDate: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 12,
      marginBottom: 8,
      opacity: 0.5,
    },
    journalContent: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
    },
    moreText: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      color: '#8568f0',

    },
    confirmationPopup: {
      position: 'absolute',
      top: 200,
      left: 10,
      right: 10,
      borderRadius: 20,
      padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmationText: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 16,
      marginBottom: 15,
      color: 'white',
    },
    confirmationButtons: {
      flexDirection: 'row',
    },
    confirmationButton: {
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: 'red',
      borderRadius: 5,
    },
    confirmationButtonText: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      color: 'white',
    },
  });

  
  const mapStateToProps = (state, ownProps) => {
    return {    
};
  };
  
  const mapDispatchToProps = { deleteJournal };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SwipeableCard);