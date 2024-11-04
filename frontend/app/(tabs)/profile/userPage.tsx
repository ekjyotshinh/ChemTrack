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
    ScrollView  
} from 'react-native';  
import { MaterialIcons } from '@expo/vector-icons';  
import CustomButton from '@/components/CustomButton';
import ReturnIcon from '@/assets/icons/ReturnIcon';
import SendIcon from '@/assets/icons/SendIcon';
import AdminUserIcon from '@/assets/icons/AdminUserIcon';
import MasterUserIcon from '@/assets/icons/MasterUserIcon';

const { width, height } = Dimensions.get('window');  

const InviteUserPage: React.FC = () => {  
    const [email, setEmail] = useState<string>('');  
    const [school, setSchool] = useState<string>('');  
    const [userType, setUserType] = useState<'Master' | 'Admin' | null>(null);  

    const handleSendInvite = (): void => {  
        if (email && school && userType) {  
            console.log('Invite sent to:', email, 'at', school, 'as', userType);  
        }  
    };  

    const handleClear = (): void => {  
        setEmail('');  
        setSchool('');  
        setUserType(null);  
    };  

    return (  
        <SafeAreaView style={styles.safeArea}>  
            <KeyboardAvoidingView   
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
                style={styles.container}  
            >  
                <ScrollView   
                    contentContainerStyle={styles.scrollContainer}  
                    bounces={false}  
                    showsVerticalScrollIndicator={false}  
                >  
                    <View style={styles.content}>  
                        {/* Title */}  
                        <Text style={styles.title}>  
                            <Text style={styles.titleHighlight}>Invite</Text> User  
                        </Text>  

                        {/* Form Fields */}  
                        <View style={styles.formContainer}>  
                            <View style={styles.inputContainer}>  
                                <Text style={styles.label}>Email</Text>  
                                <View style={styles.inputWrapper}>  
                                    <TextInput  
                                        style={styles.input}  
                                        value={email}  
                                        onChangeText={setEmail}  
                                        placeholder="Enter email"  
                                        keyboardType="email-address"  
                                        autoCapitalize="none"  
                                        autoCorrect={false}  
                                    />  
                                    <MaterialIcons name="edit" size={24} color="#ccc" />  
                                </View>  
                            </View>  

                            <View style={styles.inputContainer}>  
                                <Text style={styles.label}>School</Text>  
                                <View style={styles.inputWrapper}>  
                                    <TextInput  
                                        style={styles.input}  
                                        value={school}  
                                        onChangeText={setSchool}  
                                        placeholder="Enter school"  
                                        autoCapitalize="words"  
                                    />  
                                    <MaterialIcons name="edit" size={24} color="#ccc" />  
                                </View>  
                            </View>  

                            {/* User Type Selection with Icons */}  
                            <View style={styles.inputContainer}>  
                                <Text style={styles.label}>User Type</Text>  

                                <TouchableOpacity  
                                    style={[  
                                        styles.radioButton,  
                                        userType === 'Master' && styles.selectedRadio,  
                                    ]}  
                                    onPress={() => setUserType('Master')}  
                                >  
                                    <MasterUserIcon width={24} height={24}/>  
                                    <Text style={[  
                                        styles.radioText,  
                                        userType === 'Master' && styles.selectedRadioText,  
                                        styles.centeredText
                                    ]}>Master</Text>  
                                </TouchableOpacity>  

                                <TouchableOpacity  
                                    style={[  
                                        styles.radioButton,  
                                        userType === 'Admin' && styles.selectedRadio,  
                                    ]}  
                                    onPress={() => setUserType('Admin')}  
                                >  
                                    <AdminUserIcon width={24} height={24}/>  
                                    <Text style={[  
                                        styles.radioText,  
                                        userType === 'Admin' && styles.selectedRadioText,  
                                        styles.centeredText
                                    ]}>Admin</Text>  
                                </TouchableOpacity>  
                            </View>                             



                            {/* Custom Buttons */}  
                            <View style={styles.buttonContainer}>  
                                <CustomButton  
                                    title="Send Invite"  
                                    onPress={handleSendInvite}  
                                    color={!email || !school || !userType ? '#A5A5A5' : '#007AFF'}  
                                    width={90} 
                                    icon={<SendIcon width={24} height={24} />}  
                                    iconPosition="left"  
                                />  

                                <CustomButton  
                                    title="Clear"  
                                    onPress={handleClear}  
                                    color="#FF3B30"  
                                    width={90} 
                                    icon={<ReturnIcon width={24} height={24} />}
                                    iconPosition='left'
                                />  
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
        backgroundColor: '#f9f9f9',  
    },  
    container: {  
        flex: 1,  
    },  
    scrollContainer: {  
        flexGrow: 1,  
        paddingBottom: height * 0.08, // Space for bottom navigation  
    },  
    content: {  
        flex: 1,  
        padding: width * 0.05,  
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
        gap: height * 0.01,  
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
        marginTop: height * 0.02,  
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