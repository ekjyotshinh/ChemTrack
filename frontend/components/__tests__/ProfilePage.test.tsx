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
import Profile from '@/app/(tabs)/profile/profile';

import { render, fireEvent, waitFor } from '@testing-library/react-native';


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


// Mock Placeholder setup for User information and Routing
jest.mock('@/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));


// Tests
describe('Profile', () => {
    // Web Page Info for Testing
    let updateUserInfo: jest.Mock;
    let router: { replace: jest.Mock; push: jest.Mock };

    // Setup Mock data before and clear up after testing
    beforeEach(() => {
        updateUserInfo = jest.fn();
        router = { replace: jest.fn(), push: jest.fn() };
        (useUser as jest.Mock).mockReturnValue({ updateUserInfo });
        (useRouter as jest.Mock).mockReturnValue(router);
        jest.spyOn(Alert, 'alert');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Base User Profile Page
    test('Profile Base Page Renders', () => {
        const { getByText, getByTestId } = render(<Profile />);
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy(); // text is part of HeaderInputText, so the user's name would render too technically
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();

    });
    /* 
    // Base Master User Profile Page
    test('Profile Base Page Renders', () => {
        const { getByText, getByTestId } = render(<Profile />);
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Invite User')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();

    });

    // Edit Page
    test('Profile Edit Info Page Renders', () => {
        const { getByText } = render(<Profile />);
        // Simulate button clicks
        // POST API
        // Finish update
        // Cancel update
        expect(getByText('Cancel Edit')).toBeTruthy();
        expect(getByText('Finish Updating')).toBeTruthy();
        expect(getByText('Cancel Edit')).toBeTruthy();
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
        const { getByTestId } = render(<Profile />);
        //expect(getByTestId('confirmModal')); issues finding right now
    });*/

});
