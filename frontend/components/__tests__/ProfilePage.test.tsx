// Master Profile Page
/*
UI parts:
header (My Account): colors, font, font family, location
pic: Currently just intials and "box"
edit text (changeable: check functions)
name
email
update (switch to finish update and cancel update)
Invite user
Notifications
Reset Password
logout and its modal

*/
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
import ProfilePage from '@/app/(tabs)/profile/profile'

/*Functions:
Edit and Update Info Button:
    change email
    change name
Not implemented:
    change profile pic
Routing: Invite User page, Notifications, Reset Password, Logging out
Logging out:
    pops modal and select

*/
// Note: note apis: POST
// and user context
/*
Test ids:
    Name input
    email input
*/

// Regular User
// less components


// Mock Placeholder setup

// User Context

// Router

// Tests
describe('ProfilePage', () => {
    // Base Profile Page
    test('Profile Base Page Renders', () => { });
    // Edit Page
    test('Profile Edit Info Page Renders', () => {
        // Simulate button clicks
        // POST API
        // Finish update
        // Cancel update
    });
    // Changed layout of page when edited

    // Routing
    // Simulate clicks and return to Profile page
    // 4 pages 

    // Logout
    test('Logout Modal Renders', () => {
        // Simulate button clicks
        // Accept 
        // Decline
        // Router
    });

});
