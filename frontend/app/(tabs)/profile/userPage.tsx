import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import ReturnIcon from "@/assets/icons/ReturnIcon";
import SendIcon from "@/assets/icons/SendIcon";
import AdminUserIcon from "@/assets/icons/AdminUserIcon";
import MasterUserIcon from "@/assets/icons/MasterUserIcon";
import Colors from "@/constants/Colors";
import CustomTextHeader from "@/components/inputFields/CustomTextHeader";
import DropdownInput from '@/components/inputFields/DropdownInput';
import HeaderTextInput from "@/components/inputFields/HeaderTextInput";
import Size from "@/constants/Size";
import BlueHeader from "@/components/BlueHeader";
import { useRouter } from "expo-router";
import emailRegex from "@/functions/EmailRegex";
import { useUser } from "@/contexts/UserContext";
import ErrorPage from "../errorPage";
import fetchSchoolList from '@/functions/fetchSchool';


const InviteUserPage: React.FC = () => {
    const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
    const [email, setEmail] = useState<string>("");
    const [school, setSchool] = useState<string>("");
    const [selectedSchool, setSelectedSchool] = useState('');
    const [otherSchool, setOtherSchool] = useState('');
    const [userType, setUserType] = useState<"Master" | "Admin" | null>(null);

    const [isValidEmail, setIsValidEmail] = useState(false);
    emailRegex({ email, setIsValidEmail });

    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    const { userInfo } = useUser();

    const [schoolList, setSchoolList] = useState<any>([{label: '', value: ''}]);

    useEffect(() => {
        fetchSchoolList({setSchoolList});
    }, []);

    // Make sure that all fields are filled
   useEffect(() => {
        const isSchoolValid = selectedSchool === "Other" ? !!otherSchool : !!selectedSchool;
        if (email && isSchoolValid && userType && isValidEmail) {
          setAllFieldsFilled(true);
        } else {
          setAllFieldsFilled(false);
        }
    }, [email, selectedSchool, otherSchool, userType, isValidEmail]);
      
    const deleteUserOnUnsuccessfulInvite = async (id:string) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEmail("");
                setSchool("");
                setUserType(null);
                Alert.alert("Error", "Failed to Invite user");
            } else {
                Alert.alert("Error", "User account created but couldn't send email. Please manually convey the user to log in with that email and use forget password.");
            }
        } catch (error) {
                Alert.alert("Error", "User account created but couldn't send email. Please manually convey the user to log in with that email and use forget password.");

        }
    };

    const handleSendInvite = async () => {
        //creating user data to be used to create an account
        const school = selectedSchool === "Other" ? otherSchool : selectedSchool;

        const userData = {
        first: "",
        last: "",
        email: email,
        school: school,
        is_admin: userType === "Admin",
        is_master: userType === "Master",
        };
        if (email && school && userType) {
            if (!isValidEmail) {
                Alert.alert("Error", "Please enter a valid email address");
                return;
            }
            if (!userInfo.is_master) {
                Alert.alert(
                    "Error",
                    "You do not have permission to invite users"
                );
                return;
            }
            try {
                const res = await fetch(`${API_URL}/api/v1/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                });
                if (res.ok) {
                    // After successfully creating the user, update context and navigate
                    const data = await res.json();
                    console.log(data);
                    const id = data.user.id;
                    try {
                        // Make the request to send an invite email
                        const response = await fetch(
                            `${API_URL}/api/v1/email/send`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    to: email,
                                    subject: "ChemTrack User Invitation",
                                    // Ajays Link
                                    body: `You have been invited to join ChemTrack at ${school} as a ${userType}. Download the app from the Play Store, then tap the link below to complete your sign-up.<br><br> exp://a4sykbo-ajay_12-8081.exp.direct/--/customSignup1?id=${id}`,
                                    // EJ's Link
                                    //body: `You have been invited to join ChemTrack at ${school} as a ${userType}.<br><br>Download the app from the Play Store, then tap the link below to complete your sign-up.<br><br><a href="exp://6a-kwi4-ekjyot_shinh-8081.exp.direct/--/customSignup1?id=${id}">Sign Up Link</a>`,
                                }),
                            }
                        );
                        const data = await response.json();
                        if (response.ok) {
                            Alert.alert(
                                "Success",
                                "Invitation sent successfully!",
                                [{ text: "OK" }]
                            );
                            handleClear();

                        } else {
                            deleteUserOnUnsuccessfulInvite(id)
                        }
                    } catch (error) {
                        deleteUserOnUnsuccessfulInvite(id)
                    }
                } else if (res.status === 409) {
                    Alert.alert(
                        "Account already exists",
                        "An account already exists with this email."
                    );
                } else {
                    Alert.alert("Error creating Account for the invited user!");
                }
            } catch (error) {
                Alert.alert("Error creating Account for the invited user!");
            }
        } else {
            Alert.alert("Error", "Please fill in all the fields");
        }
    };

    const handleClear = (): void => {
        setEmail("");
        setSelectedSchool("");
        setOtherSchool("");
        setUserType(null);
    };

    const router = useRouter();

    return (
        <>
            {userInfo && userInfo.is_master ? (
                <View style={styles.safeArea}>
                    {/* Title */}
                    <BlueHeader
                        headerText={"Invite User"}
                        onPress={() => router.push("/profile/profile")}
                    />
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.container}>
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                            bounces={false}
                            showsVerticalScrollIndicator={false}>
                            <View style={styles.content}>
                                {/* Form Fields */}
                                <View style={{ alignItems: "center" }}>
                                    <HeaderTextInput
                                        onChangeText={(email) =>
                                            setEmail(email)
                                        }
                                        headerText={"Email"}
                                        value={email}
                                        inputWidth={Size.width(340)}
                                        hasIcon={true}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <View style={{ height: Size.height(10) }} />

                                    <View style={{ width: Size.width(340), marginBottom: Size.height(10) }}>
                                        <CustomTextHeader headerText="School" />
                                        <DropdownInput
                                            data={[...schoolList, { label: 'Other', value: 'Other' }]}
                                            value={selectedSchool}
                                            setValue={setSelectedSchool}
                                        />
                                    </View>

                                    <View style={{ height: Size.height(10) }} />

                                    {selectedSchool === "Other" && (
                                    <HeaderTextInput
                                        onChangeText={(text) => setOtherSchool(text)}
                                        headerText={"Enter your school"}
                                        value={otherSchool}
                                        inputWidth={Size.width(340)}
                                        hasIcon={true}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    )}

                                    <View style={{ height: Size.height(10) }} />

                                    {/* User Type Selection with Icons */}
                                    <View>
                                        <CustomTextHeader
                                            headerText={"User Type"}
                                        />

                                        <CustomButton
                                            title="Master"
                                            onPress={() =>
                                                setUserType("Master")
                                            }
                                            textColor={
                                                userType != "Master"
                                                    ? Colors.black
                                                    : Colors.white
                                            }
                                            color={
                                                userType != "Master"
                                                    ? Colors.white
                                                    : Colors.blue
                                            }
                                            width={337}
                                            icon={
                                                <MasterUserIcon
                                                    width={24}
                                                    height={24}
                                                    color={
                                                        userType != "Master"
                                                            ? Colors.black
                                                            : Colors.white
                                                    }
                                                />
                                            }
                                            iconPosition="left"
                                        />

                                        <CustomButton
                                            title="Admin"
                                            onPress={() => setUserType("Admin")}
                                            textColor={
                                                userType != "Admin"
                                                    ? Colors.black
                                                    : Colors.white
                                            }
                                            color={
                                                userType != "Admin"
                                                    ? Colors.white
                                                    : Colors.blue
                                            }
                                            width={337}
                                            icon={
                                                <AdminUserIcon
                                                    width={24}
                                                    height={24}
                                                    color={
                                                        userType != "Admin"
                                                            ? Colors.black
                                                            : Colors.white
                                                    }
                                                />
                                            }
                                            iconPosition="left"
                                        />
                                    </View>

                                    {/* Custom Buttons */}
                                    <View style={styles.buttonContainer}>
                                        <CustomButton
                                            title="Send Invite"
                                            onPress={handleSendInvite}
                                            textColor={
                                                !allFieldsFilled
                                                    ? Colors.grey
                                                    : Colors.white
                                            }
                                            color={
                                                !allFieldsFilled
                                                    ? Colors.white
                                                    : Colors.blue
                                            }
                                            width={337}
                                            icon={
                                                <SendIcon
                                                    width={24}
                                                    height={24}
                                                    color={
                                                        !allFieldsFilled
                                                            ? Colors.grey
                                                            : Colors.white
                                                    }
                                                />
                                            }
                                            iconPosition="left"
                                        />

                                        <CustomButton
                                            title="Clear"
                                            onPress={handleClear}
                                            color={Colors.red}
                                            width={337}
                                            icon={
                                                <ReturnIcon
                                                    width={24}
                                                    height={24}
                                                />
                                            }
                                            iconPosition="left"
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            ) : (
                <ErrorPage />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.offwhite,
        alignItems: "center",
    },
    container: {
        width: "100%",
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
        alignItems: "center",
    },
});

export default InviteUserPage;