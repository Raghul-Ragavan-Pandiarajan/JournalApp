import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Feather, MaterialCommunityIcons,Octicons } from '@expo/vector-icons'; 
import { connect } from 'react-redux';
import moment from 'moment';
import { addJournal } from '../redux/actions/journal';
import {Keyboard} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { auth, db, firestore } from '../firebase';
import { addDoc, collection, doc } from 'firebase/firestore';

const AddJournalScreen = ({ navigation, addJournal }) => {
  const [content, setContent] = useState('Start typing your journal here...');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('Title');
  const [titlefocus, setTitleFocus] = useState(true);
  const [contentfocus, setContentFocus] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  const [showOptions, setShowOptions] = useState(false);
  const optionsHeight = useRef(new Animated.Value(0)).current;
  const colors = useTheme().colors

  const toggleOptions = () => {
    Keyboard.dismiss()
    if (showOptions) {
      Animated.timing(optionsHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setShowOptions(false);
      });
    } else {
      setShowOptions(true);
      Animated.timing(optionsHeight, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };
  useEffect(() => {
    var currentdate = moment().format('MMMM DD, YYYY');
    setDate(currentdate);
  }, []);

  const handleAddJournal= async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    const userId = user.uid;
    try {
      const userJournalCollectionRef =  collection(db, `users/${userId}/journals`);
      const journalEntry = {
        title: title,
        content: content,
        date: date,
      };

      const docRef = await addDoc(userJournalCollectionRef, journalEntry);
     
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    
    setTitle('')
    setDate('')
    setContent('')
  }


  const optionsData = [
    { id: '1', label: 'Save Journal' , disable: isButtonDisabled, onPress: () => { 
      handleAddJournal()
      navigation.navigate('Home')
    }}, 
    { id: '2', label: 'Import Picture / Videos', onPress: () => {} },
    { id: '3', label: 'Import Files', onPress: () => {} }, 
  ];

  const interpolatedHeight = optionsHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, optionsData.length * 60],
  });

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Octicons name="arrow-left" size={34} color={colors.text} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionsIcon} onPress={toggleOptions}>
        <MaterialCommunityIcons name="dots-horizontal" size={34} color={colors.text}/>
      </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <TextInput 
      style={[styles.titleInput ,titlefocus ? {color: colors.border}: {color: colors.text}]}
      value={title}
      textAlignVertical='top'
      onFocus={ ()=> {
        setTitle('')
        setTitleFocus(false)
        Animated.timing(optionsHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setShowOptions(false);
        });
      }}
      onChangeText={(title) => {
        setTitle(title);
        if (title !== '') {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
      }}
      />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <TextInput 
      style={[styles.contentInput, contentfocus ? {color: colors.border}: {color: colors.text}]}
      multiline
      value={content}
      onFocus={ ()=> {
        setContentFocus(false)
        setContent('')
        Animated.timing(optionsHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setShowOptions(false);
        });
      }}
      onChangeText={(content) => {
        setContent(content);
        if (content !== '') {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
       }}
      />
      </TouchableWithoutFeedback>
      
      
      <Animated.View style={[styles.optionsRectangle, { height: interpolatedHeight, borderColor: colors.borderColor }]}>
          {optionsData.map(option => (
            <TouchableOpacity key={option.id} style={[styles.optionItem, {backgroundColor: colors.background }]} onPress={option.onPress} disabled={option.disable}>
              <Text style={[option.disable ? styles.optionLabelDisabled : styles.optionLabel, {color: colors.text}]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  profileIcon: {
    borderRadius: 16,
  },
  titleInput: {
    margin: 15,
    fontFamily: 'GeneralSans-Regular',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentInput: {
    margin: 15,
    fontFamily: 'GeneralSans-Regular',
    fontSize: 20,
    flex: 1,
    textAlignVertical: 'top'
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    marginTop: 10,
    margin: 15,
    marginRight: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  
  optionsRectangle: {
    position: 'absolute',
    width:'100%',
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  optionLabel: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 18,
  },
  optionLabelDisabled: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 18,
    color: 'grey'
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = { addJournal };

export default connect(mapStateToProps, mapDispatchToProps)(AddJournalScreen);
