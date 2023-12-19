import React, { useState, useRef  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Modal, FlatList } from 'react-native';
import { Feather, MaterialCommunityIcons,Octicons } from '@expo/vector-icons'; 
import { connect } from 'react-redux';
import { getDataById } from '../redux/selector/selector'
import { useTheme } from '@react-navigation/native';

const ViewJournalScreen = ({ navigation, route, journalsData }) => {
    const colors = useTheme().colors;
    const { id } = route.params;
    const selectedJournal = getDataById(journalsData, id);
    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="arrow-left" size={34} color={colors.text} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.dateText, {color: colors.text}]}>{selectedJournal.date}</Text>
          <Text style={[styles.titleText, {color: colors.text}]}>{selectedJournal.title}</Text>
          <Text style={[styles.contentText, {color: colors.text}]}>{selectedJournal.content}</Text>
          
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
    titleText: {
      margin: 15,
      fontFamily: 'GeneralSans-Medium',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    contentText: {
      margin: 15,
      fontFamily: 'GeneralSans-Regular',
      fontSize: 16,
    },
    dateText: {
      margin: 15,
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      opacity: 0.8,
    }
    
  });
  const mapStateToProps = state => ({
    journalsData: state.journalReducer.journalsData,
  });

export default connect(mapStateToProps)(ViewJournalScreen);