import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { Octicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useTheme } from '@react-navigation/native';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker'
import { addUser, deleteUser } from '../redux/actions/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteJournalAll } from '../redux/actions/journal';
import { isLoading } from 'expo-font';


const ProfileScreen = ({ navigation, user, addUser, deleteUser, deleteJournalAll }) => {

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio); 
  const [photoURL, setPhotoURL] = useState('')
  const colors = useTheme().colors
  const [isLoading, setIsLoading] = useState(false);


  const toggleEditBio = () => {
    setIsEditingBio(!isEditingBio);
  };
  const handleLogout = async() => {
    deleteUser(user.name);
    deleteJournalAll()
    await signOut(auth)
  }

  
  useEffect(()=> {
    setPhotoURL(auth.currentUser?.photoURL)
    addUser(auth.currentUser?.displayName, auth.currentUser?.photoURL, editedBio)
  },[photoURL,editedBio])

  const saveEditedBio = async () => {
    
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    
    const userId = user.uid;
    const userJournalCollectionRef = collection(db, `users/${userId}/userProfileData`);
    
    const bioData = {
      bio: editedBio,
    };
  
    const bioDocRef = doc(userJournalCollectionRef, 'bio'); 
  
    try {
      const bioDocSnapshot = await getDoc(bioDocRef);
  
      if (bioDocSnapshot.exists()) {
        await updateDoc(bioDocRef, bioData);
      } else {
        await setDoc(bioDocRef, bioData);
      }
      addUser(auth.currentUser?.displayName, auth.currentUser?.photoURL, editedBio)
      setIsEditingBio(false);
    } catch (error) {
      console.error("Error updating bio: ", error);
    }
  };

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.01,
    });
  
    if (!result.canceled) {
      const user = auth.currentUser;
      
      if (user) {
        try {
          const filename = `profile_image/${user.uid}`;
          const storageRef = ref(storage, filename);

          setIsLoading(true);
          
           const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();
          
          await uploadBytes(storageRef, blob);
          
          const downloadURL = await getDownloadURL(storageRef);
          
  
          await updateProfile(user, { photoURL: downloadURL });
          setPhotoURL(downloadURL)
          setIsLoading(false);
      
        } catch (error) {
          console.error('Error updating user photo URL:', error); 
          setIsLoading(false)
        }
      }
    }
  };

  
  
    return (
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <Image
                source={photoURL ? { uri: photoURL } : require('../assets/profile-image.jpg')}
                style={styles.profileImage}
              />
              
           
              <View style={styles.iconHeader}>
              <TouchableOpacity  style={styles.buttonBack} onPress={() => navigation.goBack()}>
          <Octicons name="arrow-left" size={34} color="black" style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity  style={styles.locked} onPress={handleImageSelection}>
          <MaterialCommunityIcons name="camera-plus" size={28} color="#8568f0" style={styles.icon} />
        </TouchableOpacity>
              </View>  
              {isLoading && <ActivityIndicator style={{ position: 'absolute', top: 200, flex:1,width: '100%', justifyContent: 'center'}} size="large" color="white" />}         
            <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, {color: colors.text}]}>About me</Text>
          </View>
          <View style={styles.bodyName}>
            <Text style={[styles.bodyNameTitle, {color: colors.text}]}>Name</Text>
            <Text style={[styles.bodyNameUser, {color: colors.text}]}>{user.name}</Text>
          </View>
          <View style={styles.bodyBio}>
  <Text style={[styles.bodyBioTitle, { color: colors.text }]}>Bio</Text>
  
  {isEditingBio ? (
    <TextInput
      value={editedBio}
      onFocus={()=> {setEditedBio('')}}
      onChangeText={(bio)=>{setEditedBio(bio)}}
      multiline
      numberOfLines={4} 
      style={[styles.editableBioTextArea, {color: colors.text}]}
    />
  ) : (
    <Text style={[styles.bodyBioUser, { color: colors.text }]}>{user.bio}</Text>
  )}
  <View style={styles.buttonContainer}>
  {isEditingBio ? (
    <TouchableOpacity style={styles.cancelButton} onPress={toggleEditBio}>
      <Text style={{color: colors.text}}>Cancel</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.editButton} onPress={toggleEditBio}>
      <MaterialCommunityIcons name="pencil" size={18} color={colors.text} />
    </TouchableOpacity>
  )}
  {isEditingBio && (
    <TouchableOpacity style={styles.saveButton} onPress={saveEditedBio}>
      <Text style={{color: colors.text}} >Save</Text>
    </TouchableOpacity>
  )}
  </View>
  
</View>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.buttonTextLogout} >Logout</Text>
        </TouchableOpacity>
        </SafeAreaView>
        </View>
        </KeyboardAwareScrollView>                 
    );

};
const styles = StyleSheet.create({

    topContainer: {
      flex: 1
    },
    container: {
      flex: 1,
      backgroundColor: '#fcfbfc',
      paddingTop: 30,  
    },
    image: {
      width: 250,
      height: 250,
      marginBottom: 20,
    },
    iconHeader: {
        position: 'absolute',
        top: 70,
        width: '100%',
        paddingHorizontal: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontFamily: 'GeneralSans-SemiBold',
      fontSize: 34,
      width: 200,
    },
    profileImage: {
      width: '100%',
      height: 400,
    },
    buttonLogout: {
        backgroundColor: "#8568f0",
        borderRadius: 20,
        paddingVertical: 15,
        margin: 20,
        marginTop: 10
    },
    buttonTextLogout: {
        fontFamily: 'GeneralSans-SemiBold',
        fontSize: 16,
        textAlign: 'center',
        color: "white"
    },
    bodyName: {
        margin: 20,
        marginTop: 10,
        display: 'flex',
        marginBottom: 10,
    },
    bodyNameTitle: {
        fontFamily: 'GeneralSans-SemiBold',
        fontSize: 18,
        marginBottom: 10,
    },
    bodyNameUser: {
        fontFamily: 'GeneralSans-Regular',
        fontSize: 16,
    },
    bodyBio: {
        margin: 20,
        display: 'flex',
        marginTop: 10,
    },
    bodyBioTitle: {
        fontFamily: 'GeneralSans-SemiBold',
        fontSize: 18,
        marginBottom: 10,
    },
    bodyBioUser: {
        fontFamily: 'GeneralSans-Regular',
        fontSize: 14,
        height: 110,
        
    },

    editableBioTextArea: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      height: 110,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 10,
      paddingVertical:6,
      textAlignVertical: 'top'
    },
    saveButton: {
      alignSelf: 'flex-end',
    },
    saveButtonText: {
      fontFamily: 'GeneralSans-SemiBold',
      fontSize: 14,
      color: 'white',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }

  });
  


  const mapStateToProps = (state, ownProps) => {
    return {
      user: state.userReducer.user
    };
  };
  
  const mapDispatchToProps = { addUser, deleteUser, deleteJournalAll };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);