import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from 'react-native';
import CustomButton from '@/components/CustomButton';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SendIcon from '@/assets/icons/SendIcon';
import AdminUserIcon from '@/assets/icons/AdminUserIcon';
import MasterUserIcon from '@/assets/icons/MasterUserIcon';
import Colors from '@/constants/Colors';
import CustomTextHeader from '@/components/inputFields/CustomTextHeader';
import HeaderTextInput from '@/components/inputFields/HeaderTextInput';
import Size from '@/constants/Size';
import BlueHeader from '@/components/BlueHeader';
import { useRouter } from 'expo-router';
import emailRegex from '@/functions/EmailRegex';

const InviteUserPage: React.FC = () => {
    const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
    const [email, setEmail] = useState<string>('');
    const [school, setSchool] = useState<string>('');
    const [userType, setUserType] = useState<'Master' | 'Admin' | null>(null);

    const [isValidEmail, setIsValidEmail] = useState(false);
    emailRegex({ email, setIsValidEmail });

    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    // Make sure that all fields are filled
    useEffect(() => {
        if (email && school && userType && isValidEmail) {
            setAllFieldsFilled(true);
        } else {
            setAllFieldsFilled(false);
        }
    }, [email, school, userType, isValidEmail]);

    const handleSendInvite = async () => {
        if (email && school && userType) {
            if (!isValidEmail) {
                Alert.alert('Error', 'Please enter a valid email address');
                return;
            }
            try {
                // Make the request to send an invite email
                const response = await fetch(`${API_URL}/api/v1/email/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: email,
                        subject: 'ChemTrack User Invitation',
                        body: `Email sent successfully from the invite user screen. User type: ${userType} and user School: ${school}. TODO: Implement user invitation flow (password(create random password and have user update the password upon login) or use magic link).`,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Success alert
                    Alert.alert('Success', 'Invitation sent successfully!', [{ text: 'OK' }]);
                    // Reset the form fields
                    setEmail('');
                    setSchool('');
                    setUserType(null);
                } else {
                    // Error alert, either from the API or general fallback
                    Alert.alert('Error', data.error || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Error sending invite:', error);  // Log the full error for debugging
                Alert.alert('Error', 'An error occurred. Please try again later.');
            }
        } else {
            // Ensure user has filled in all fields
            Alert.alert('Error', 'Please fill in all the fields');
        }
    };

    const handleClear = (): void => {
        setEmail('');
        setSchool('');
        setUserType(null);
    };

    const router = useRouter()

    return (
        <View style={styles.safeArea}>
            {/* Title */}
            <BlueHeader headerText={'Invite User'} onPress={() => router.push('/profile/profile')} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        {/* Form Fields */}
                        <View style={{ alignItems: 'center' }}>
                            <HeaderTextInput
                                onChangeText={email => setEmail(email)}
                                headerText={'Email'}
                                value={email}
                                inputWidth={Size.width(340)}
                                hasIcon={true}
                                keyboardType='email-address'
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <View style={{ height: Size.height(10) }} />
                            <HeaderTextInput
                                onChangeText={school => setSchool(school)}
                                headerText={'School'}
                                value={school}
                                inputWidth={Size.width(340)}
                                hasIcon={true}
                            />
                            <View style={{ height: Size.height(10) }} />

                            {/* User Type Selection with Icons */}
                            <View>
                                <CustomTextHeader headerText={'User Type'} />

                                <CustomButton
                                    title="Master"
                                    onPress={() => setUserType('Master')}
                                    textColor={userType != 'Master' ? Colors.black : Colors.white}
                                    color={userType != 'Master' ? Colors.white : Colors.blue}
                                    width={337}
                                    icon={
                                        <MasterUserIcon
                                            width={24}
                                            height={24}
                                            color={userType != 'Master' ? Colors.black : Colors.white}
                                        />}
                                    iconPosition="left"
                                />

                                <CustomButton
                                    title="Admin"
                                    onPress={() => setUserType('Admin')}
                                    textColor={userType != 'Admin' ? Colors.black : Colors.white}
                                    color={userType != 'Admin' ? Colors.white : Colors.blue}
                                    width={337}
                                    icon={
                                        <AdminUserIcon
                                            width={24}
                                            height={24}
                                            color={userType != 'Admin' ? Colors.black : Colors.white}
                                        />}
                                    iconPosition="left"
                                />
                            </View>


                            {/* Custom Buttons */}
                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title="Send Invite"
                                    onPress={handleSendInvite}
                                    textColor={!allFieldsFilled ? Colors.grey : Colors.white}
                                    color={!allFieldsFilled ? Colors.white : Colors.blue}
                                    width={337}
                                    icon={
                                        <SendIcon
                                            width={24}
                                            height={24}
                                            color={!allFieldsFilled ? Colors.grey : Colors.white}
                                        />}
                                    iconPosition="left"
                                />

                                <CustomButton
                                    title="Clear"
                                    onPress={handleClear}
                                    color={Colors.red}
                                    width={337}
                                    icon={<ReturnIcon width={24} height={24} />}
                                    iconPosition='left'
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.offwhite,
        alignItems: 'center',       
    },
    container: {
        width: '100%',      
    },
    scrollContainer: {
        flexGrow: 1,    
    },
    content: {
        flex: 1,
        marginTop: Size.height(136),
    },
    buttonContainer: {
        marginTop: Size.height(43),
        gap: Size.height(10.3),
        alignItems: 'center',
    },

});

export default InviteUserPage;