import React, { useState } from 'react';  
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';  
import { MaterialIcons } from '@expo/vector-icons';  

const InviteUserPage: React.FC = () => {  
    const [email, setEmail] = useState('');  
    const [school, setSchool] = useState('');  
    const [userType, setUserType] = useState<'Master' | 'Admin' | null>(null);  

    const handleSendInvite = () => {  
        console.log('Invite sent to:', email, 'at', school, 'as', userType);  
    };  

    const handleClear = () => {  
        setEmail('');  
        setSchool('');  
        setUserType(null); // Reset to allow user to select any type  
    };  

    return (  
        <View style={styles.container}>  
            <Text style={styles.title}>  
                <Text style={styles.titleHighlight}>Invite</Text> User  
            </Text>  
            <View style={styles.inputContainer}>  
                <Text style={styles.label}>Email</Text>  
                <View style={styles.inputWrapper}>  
                    <TextInput  
                        style={styles.input}  
                        value={email}  
                        onChangeText={setEmail}  
                        placeholder="Enter email"  
                        keyboardType="email-address"  
                    />  
                    <MaterialIcons name="edit" size={20} color="#ccc" />  
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
                    />  
                    <MaterialIcons name="edit" size={20} color="#ccc" />  
                </View>  
            </View>  
            <Text style={styles.label}>User Type</Text>  
            <View style={styles.radioContainer}>  
                <TouchableOpacity  
                    style={[  
                        styles.radio,  
                        userType === 'Master' && styles.selectedRadio,  
                    ]}  
                    onPress={() => setUserType('Master')}  
                >  
                    <Text  
                        style={[  
                            styles.radioText,  
                            userType === 'Master' && styles.selectedRadioText,  
                        ]}  
                    >  
                        Master  
                    </Text>  
                </TouchableOpacity>  
                <TouchableOpacity  
                    style={[  
                        styles.radio,  
                        userType === 'Admin' && styles.selectedRadio,  
                    ]}  
                    onPress={() => setUserType('Admin')}  
                >  
                    <Text  
                        style={[  
                            styles.radioText,  
                            userType === 'Admin' && styles.selectedRadioText,  
                        ]}  
                    >  
                        Admin  
                    </Text>  
                </TouchableOpacity>  
            </View>  
            <View style={styles.buttonContainer}>  
                <TouchableOpacity  
                    style={[  
                        styles.sendButton,  
                        userType && styles.activeSendButton, // Apply active style if a user type is selected  
                    ]}  
                    onPress={handleSendInvite}  
                >  
                    <Text style={styles.buttonText}>Send Invite</Text>  
                </TouchableOpacity>  
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>  
                    <Text style={styles.buttonText}>Clear</Text>  
                </TouchableOpacity>  
            </View>  
        </View>  
    );  
};  

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 20,  
        justifyContent: 'flex-start',  
        backgroundColor: '#f9f9f9',  
    },  
    title: {  
        fontSize: 40,  
        fontWeight: 'bold',  
        marginBottom: 30,  
    },  
    titleHighlight: {  
        color: '#007BFF',  
    },  
    inputContainer: {  
        marginBottom: 20,  
    },  
    label: {  
        fontSize: 20,  
        fontWeight: 'bold',  
        marginBottom: 5,  
    },  
    inputWrapper: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        borderWidth: 1,  
        borderColor: '#ccc',  
        padding: 10,  
    },  
    input: {  
        flex: 1,  
        marginRight: 10,  
        height: 40,  
        fontSize: 22,  
    },  
    radioContainer: {  
        flexDirection: 'column',  
        justifyContent: 'flex-start',  
        marginBottom: 180,  
    },  
    radio: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        padding: 10,  
        borderWidth: 1,  
        borderColor: '#ccc',  
        borderRadius: 5,  
        width: '100%',  
        justifyContent: 'center',  
        marginBottom: 10,  
    },  
    selectedRadio: {  
        backgroundColor: '#e6f0ff',  
        borderColor: '#007BFF',  
    },  
    radioText: {  
        fontSize: 20,  
        fontWeight: 'bold',  
        marginLeft: 5,  
    },  
    selectedRadioText: {  
        color: '#007BFF',  
    },  
    buttonContainer: {  
        flexDirection: 'column',  
        alignItems: 'center',  
        justifyContent: 'space-between',  
        padding: 10,  
    },  
    sendButton: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        backgroundColor: '#ccc', // Default color  
        padding: 15,  
        borderRadius: 8,  
        width: '100%',  
        justifyContent: 'center',  
        marginBottom: 10,  
    },  
    activeSendButton: {  
        backgroundColor: '#007BFF', // Active color when a user type is selected  
    },  
    clearButton: {  
        flexDirection: 'row',  
        alignItems: 'center',  
        backgroundColor: '#FF0000',  
        padding: 15,  
        borderRadius: 8,  
        width: '100%',  
        justifyContent: 'center',  
    },  
    buttonText: {  
        color: '#fff',  
        marginLeft: 5,  
        fontWeight: 'bold',  
        fontSize: 20,  
    },  
});  

export default InviteUserPage;