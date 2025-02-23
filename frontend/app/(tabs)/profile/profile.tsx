import { useState, useEffect } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import CustomButton from '@/components/CustomButton';
import AddUserIcon from '@/assets/icons/AddUserIcon';
import BellIcon from '@/assets/icons/BellIcon';
import EditIcon from '@/assets/icons/EditIcon';
import ResetIcon from '@/assets/icons/ResetIcon';
import LoginIcon from '@/assets/icons/LoginIcon';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import TextInter from '@/components/TextInter';
import { useRouter } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import emailRegex from '@/functions/EmailRegex';
import CloseIcon from '@/assets/icons/CloseIcon';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(false);
  emailRegex({ email, setIsValidEmail });

  const router = useRouter();
  const { userInfo, updateUserInfo } = useUser();
  const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;

  // Initialize name and email from user info
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  // Get initials for the avatar
  const getInitials = (fullName: string) =>
    fullName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  const handleUpdateInfo = async () => {
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    // Don't allow the user to update with invalid information
    if (!firstName || !lastName || !isValidEmail) {
      Alert.alert('Error', 'Please fill in all fields with valid information');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first: firstName,
          last: lastName,
          email,
        }),
      });

      if (!response.ok) throw new Error('Failed to update user info');

      updateUserInfo({
        ...userInfo,
        name: `${firstName} ${lastName}`,
        email,
      });

      setIsEditing(false);
      Alert.alert('Success', 'Your info has been updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update your information.');
      console.error(error);
    }
  };

  // Cancel editing and reset the inputs to the original values
  const handleCancel = () => {
    setEmail(userInfo.email);
    setName(userInfo.name);
    setIsEditing(false);
  }

  return (
    <View style={styles.container}>
      <Header headerText="My Account" />

      <ScrollView style={styles.scrollContainer}>
        <View style={{ marginTop: Size.height(136), alignItems: 'center' }}>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarImage}>
              <TextInter style={styles.avatarText}>
                {userInfo?.name ? getInitials(userInfo.name) : ''}
              </TextInter>
            </View>
          </View>

          {/* Name and Email Inputs */}
          <View>
            <TouchableOpacity onPress={isEditing ? handleCancel : () => setIsEditing(true)}>
              <Text style={styles.editText}>
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <HeaderTextInput
            onChangeText={setName}
            headerText="Name"
            value={name}
            hasIcon={isEditing}
            inputWidth={Size.width(340)}
            disabled={!isEditing}
          />
          <View style={{ height: Size.height(10) }} />
          <HeaderTextInput
            onChangeText={setEmail}
            headerText="Email"
            value={email}
            hasIcon={isEditing}
            inputWidth={Size.width(340)}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={!isEditing}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title={isEditing ? 'Finish Updating' : 'Update Info'}
            color={isEditing ? ((!name || !isValidEmail) ? Colors.white : Colors.blue) : Colors.white}
            textColor={isEditing ? (!name || !isValidEmail ? Colors.grey : Colors.white) : Colors.black}
            onPress={isEditing ? handleUpdateInfo : () => setIsEditing(true)}
            width={337}
            icon={<EditIcon width={24} height={24} color={isEditing ? (!name || !isValidEmail ? Colors.grey : Colors.white) : Colors.black} />}
            iconPosition="left"
          />
          {/* Only show when editing */}
          {isEditing &&
            <CustomButton
              title={'Cancel Edit'}
              color={Colors.red}
              textColor={Colors.white}
              onPress={handleCancel}
              width={337}
              icon={<CloseIcon width={18} height={18} color={Colors.white} />}
              iconPosition="left"
            />
          }
          {/* Only show these buttons when NOT editing */}
          {!isEditing &&
            <>
              {userInfo && userInfo.is_master && (
                <CustomButton
                  title="Invite User"
                  color={Colors.white}
                  textColor={Colors.black}
                  onPress={() => router.push('/profile/userPage')}
                  width={337}
                  icon={<AddUserIcon width={24} height={24} color={Colors.black} />}
                  iconPosition="left"
                />
              )}
              <CustomButton
                title="Notifications"
                color={Colors.white}
                textColor={Colors.black}
                onPress={() => router.push('/profile/notifications')}
                width={337}
                icon={<BellIcon width={24} height={24} color={Colors.black} />}
                iconPosition="left"
              />
              <CustomButton
                title="Reset Password"
                color={Colors.white}
                textColor={Colors.black}
                onPress={() => router.push('/profile/resetPassword')}
                width={337}
                icon={<ResetIcon width={24} height={24} color={Colors.black} />}
                iconPosition="left"
              />
              <CustomButton
                title="Log Out"
                color={Colors.red}
                textColor={Colors.white}
                onPress={() => setConfirmModalVisible(true)}
                width={337}
                icon={<LoginIcon width={24} height={24} color={Colors.white} />}
                iconPosition="left"
              />
            </>
          }
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text>Are you sure you want to log out?</Text>

            <Pressable
              style={styles.closePopUpButton}
              onPress={() => (setConfirmModalVisible(false), router.push('/(auth)/login'))}
            >
              <Text style={styles.popUpText}>Yes</Text>
            </Pressable>

            <Pressable
              style={styles.closePopUpButton}
              onPress={() => setConfirmModalVisible(false)}
            >
              <Text style={styles.popUpText}>Cancel</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    shadowOpacity: 0.5,
    shadowOffset: { height: 1, width: 0.2 },
    elevation: 2,
  },
  avatarText: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.white,
  },
  editText: {
    color: Colors.blue,
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: Size.height(25),
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  closePopUpButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 5,
  },
  popUpText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
