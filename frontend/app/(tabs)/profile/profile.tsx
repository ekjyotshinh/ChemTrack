import React, { useState, useEffect } from 'react';
import { Alert, View, ScrollView, Button, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Modal, Pressable } from 'react-native';
import CustomButton from '@/components/CustomButton';
import EditIcon from '@/assets/icons/EditIcon';
import AddUserIcon from '@/assets/icons/AddUserIcon';
import BellIcon from '@/assets/icons/BellIcon';
import ResetIcon from '@/assets/icons/ResetIcon';
import LoginIcon from '@/assets/icons/LoginIcon';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import TextInter from '@/components/TextInter';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext'; // import the hook to get user info

export default function ViewChemicals() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initials, setInitials] = useState('');
  const router = useRouter();  // Initialize router for navigation
  const { userInfo, updateUserInfo } = useUser(); // Get the username from context
  const [isEditing, setIsEditing] = useState(false)

  const API_URL = "http://10.0.0.24:8080"; // Update with your backend IP address and port

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  // Put API to update name and email
  const updateInfo = async (someName: string, someEmail: string) => {
    console.log(someName);
    console.log(someEmail);
    const fullName = someName.split(' ');
    const firstName = fullName[0];
    const lastName = fullName[fullName.length - 1];
    try {
      // calling the backend api to update name and email in the database
      const url = `${API_URL}/api/v1/users/${userInfo.id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first: firstName,
          last: lastName,
          email: someEmail,
        })
      })
      const data = await response.json();

      // updating the name and email in the frontend
      updateUserInfo({
        name: firstName + " " + lastName,
        email: someEmail,
        is_admin: userInfo.is_admin,
        is_master: userInfo.is_master,
        school: userInfo.school,
        id: userInfo.id,
      });
      setIsEditing(false)
      Alert.alert("Your Info Updated!");
      console.log('info updated')
      console.log('Log userInfo name: ', userInfo.name);
    } catch (error) {
      Alert.alert("Error in updating the information.");
      console.error(error)
    }
  }


  // Variables for Modal PopUp
  const [confirmPress, setConfirmPress] = React.useState(false);
  const openPopUp = () => setConfirmPress(true);
  const closePopUp = () => setConfirmPress(false);

  //Function to get initials of user
  const getInitals = (someName: string) => {
    const fullName = someName.split(' ');
    let initials = '';
    for (let i = 0; i < fullName.length; i++) {
      initials = initials.concat(fullName[i].charAt(0));
    }
    return initials;
  };


  // Function to set the avatar as initials
  const defaultAvatar = () => {
    const [initials, setIntials] = React.useState('');
    return getInitals(userInfo.name);
  };


  return (

    <View style={styles.container}>
      <Header headerText={'My Account'} />

      <ScrollView style={styles.scrollContainer}>

        <View style={{ marginTop: Size.height(136) }}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarImage}>
              <TextInter style={styles.avatarText}> {defaultAvatar()}</TextInter>
            </View>
          </View>

          <View>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center' }}>
            <HeaderTextInput
              onChangeText={name => setName(name)}
              headerText={'Name'}
              value={name}
              hasIcon={true}
              inputWidth={Size.width(340)}
              disabled={!isEditing ? true : false} />

            <View style={{ height: Size.height(10) }} />

            <HeaderTextInput
              onChangeText={email => setEmail(email)}
              headerText={'Email'}
              hasIcon={true}
              value={email}
              inputWidth={Size.width(340)}
              keyboardType='email-address'
              autoCapitalize='none'
              disabled={!isEditing ? true : false} />
          </View>

          <View style={{ height: Size.height(40) }} />

          <View style={styles.buttonContainer}>

            <CustomButton
              title={!isEditing ? "Update Info" : "Finish Updating"}
              color={Colors.white}
              textColor={Colors.black}
              onPress={() => { isEditing ? updateInfo(name.toString(), email.toString()) : setIsEditing(true) }}
              width={337}
              icon={<EditIcon width={24} height={24} color={Colors.black} />}
              iconPosition='left'
            />

            <CustomButton
              title="Invite User"
              color={Colors.white}
              textColor={Colors.black}
              onPress={() => router.push('/profile/userPage')}
              width={337}
              icon={<AddUserIcon width={24} height={24} color={Colors.black} />}
              iconPosition='left'
            />
            <CustomButton
              title="Notifications"
              color={Colors.white}
              textColor={Colors.black}
              onPress={() => Alert.alert('Notifications pressed')}
              width={337}
              icon={<BellIcon width={24} height={24} color={Colors.black} />}
              iconPosition='left'
            />
            <CustomButton
              title="Reset Password"
              color={Colors.white}
              textColor={Colors.black}
              onPress={() => Alert.alert('Reset Password pressed')}
              width={337}
              icon={<ResetIcon width={24} height={24} color={Colors.black} />}
              iconPosition='left'
            />
            <CustomButton
              title="Log Out"
              color={Colors.red}
              textColor={Colors.white}
              onPress={openPopUp}
              width={337}
              icon={<LoginIcon width={24} height={24} color={Colors.white} />}
              iconPosition='left'
            />


          </View>
          <View style={{ height: Size.height(30) }} />
        </View>
      </ScrollView>

      {/*Testing Modal model with borrowed styling */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmPress}
        onRequestClose={() => {
          Alert.alert('Popup has been closed.');
          setConfirmPress(!confirmPress);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text >Button Works!</Text>
            <Pressable
              style={styles.closePopUpButton}
              onPress={closePopUp}>
              <Text style={styles.popUpText}>Hide PopUp</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}



let users: { name: string, email: string, password: string }[] = [
  {
    name: 'Admin John',
    email: 'admin@example.com',
    password: 'super123',
  },
  {
    name: 'User Bob',
    email: 'user@example.com',
    password: 'user123',
  },
];

{/*StyleSheet */ }

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.offwhite,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4285F4',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
  },
  titleSecondWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',

  },
  avatarContainer: {
    alignSelf: 'center',
  },
  avatarImage: {
    width: Size.width(132),
    height: Size.width(132),
    borderRadius: 100,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,

    shadowColor: Colors.grey,
    shadowRadius: 0.5,
    shadowOpacity: 2,
    shadowOffset:
    {
      height: 1,
      width: 0.2,
    },

  },
  avatarText: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.white,
    // It's not lining up for some reason but this padding evens it out
    paddingRight: 10,
  },
  editText: {
    color: '#4285F4',
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  inputHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 5,
    paddingHorizontal: 20,
  },
  inputBox: {
    fontSize: 15,
    borderColor: 'silver',
    borderWidth: 1,
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('screen').width - 50,
    paddingHorizontal: 7,
    paddingVertical: 8,
    margin: 6,
    alignSelf: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },

  functionButtons: {
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 8,
    margin: 10,
    width: Dimensions.get('screen').width - 55,
    alignSelf: 'center',

    shadowColor: 'grey',
    shadowRadius: 0.5,
    shadowOpacity: 1,
    shadowOffset:
    {
      height: 1,
      width: 0.1,
    },
  },
  functionButtonsText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',

  },
  logOutButton: {
    backgroundColor: 'red',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 8,
    margin: 10,
    width: Dimensions.get('screen').width - 55,
    alignSelf: 'center',

    shadowColor: 'silver',

    shadowRadius: .8,
    shadowOpacity: 1,
    shadowOffset:
    {
      height: 1,
      width: 1,
    },

  },
  logOutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 130,
  },
  popup: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popUpText: {
    textAlign: 'center',

  },
  closePopUpButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 8,
    margin: 10,
    width: Dimensions.get('screen').width - 55,
    alignSelf: 'center',
  },
});
