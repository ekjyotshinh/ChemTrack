import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Alert
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
import Header from '@/components/Header';

const { width, height } = Dimensions.get('window');

const InviteUserPage: React.FC = () => {
    const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
    const [email, setEmail] = useState<string>('');
    const [school, setSchool] = useState<string>('');
    const [userType, setUserType] = useState<'Master' | 'Admin' | null>(null);

    const handleSendInvite = async () => {
        if (email && school && userType) {
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

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Title */}
            <Header headerText={'Invite User'} />
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
                            <View style={styles.inputContainer}>
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
                                    textColor={!email || !school || !userType ? Colors.grey : Colors.white}
                                    color={!email || !school || !userType ? Colors.white : Colors.blue}
                                    width={337}
                                    icon={
                                        <SendIcon
                                            width={24}
                                            height={24}
                                            color={!email || !school || !userType ? Colors.grey : Colors.white}
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
                                {/* <View style={{height: 10000}}/> */}
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        // paddingBottom: height * 0.08, // Space for bottom navigation  
    },
    content: {
        flex: 1,
        // padding: width * 0.05,
        paddingTop: Size.height(136),
    },
    title: {
        fontSize: Math.min(width * 0.07, 28),
        fontWeight: 'bold',
        marginBottom: height * 0.03,
    },
    titleHighlight: {
        color: '#007AFF',
    },
    formContainer: {
        gap: height * 0.02,
    },
    inputContainer: {
        // gap: height * 0.01,
    },
    label: {
        fontSize: Math.min(width * 0.04, 16),
        fontWeight: '600',
        color: '#000',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        paddingHorizontal: width * 0.04,
        height: height * 0.06,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        fontSize: Math.min(width * 0.04, 16),
        color: '#000',
    },
    radioButton: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 10,
        padding: height * 0.02,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginBottom: height * 0.01,
        flexDirection: 'row',
    },
    selectedRadio: {
        backgroundColor: '#007AFF20',
        borderColor: '#007AFF',
    },
    radioText: {
        fontSize: Math.min(width * 0.04, 16),
        fontWeight: '500',
        color: '#000',
        alignItems: 'center',
    },
    selectedRadioText: {
        color: '#007AFF',
    },
    buttonContainer: {
        marginTop: Size.height(43),
        gap: height * 0.012,
        alignItems: 'center',
    },
    button: {
        borderRadius: 10,
        padding: height * 0.018,
        alignItems: 'center',
    },
    sendButton: {
        backgroundColor: '#007AFF',
    },
    clearButton: {
        backgroundColor: '#FF3B30',
    },
    disabledButton: {
        backgroundColor: '#A5A5A5',
    },
    buttonText: {
        color: '#fff',
        fontSize: Math.min(width * 0.04, 16),
        fontWeight: '600',
    },
    centeredText: {
        flex: 1, // Take up remaining space
        textAlign: 'center', // Center text
    },

});

export default InviteUserPage;