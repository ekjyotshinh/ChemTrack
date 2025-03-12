import React, { useState, useEffect } from 'react';
import {
    Alert,
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
import { useRouter } from 'expo-router';
import Profile from '@/app/(tabs)/profile/profile';
import { useUser } from '@/contexts/UserContext';
import emailRegex from '@/functions/EmailRegex';
import CloseIcon from '@/assets/icons/CloseIcon';

import { render, fireEvent, screen, waitFor, getQueriesForElement } from '@testing-library/react-native';


// Mock Placeholder setup for User information and Routing

jest.mock('@/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

// Define User types and data
// Based on user context file
interface UserInfo {
    name: string;
    email: string;
    is_admin: boolean;
    is_master: boolean;
    school: string;
    id: string;
    allow_email: boolean;
    allow_push: boolean;
};

let mockUser: UserInfo = {
    name: 'Test User',
    email: 'user@example.com',
    is_admin: false,
    is_master: false,
    school: 'Test School',
    id: '123',
    allow_email: true,
    allow_push: false,
};
(useUser as jest.Mock).mockReturnValue({ userInfo: mockUser });

let mockMaster: UserInfo = {
    name: 'Test Admin',
    email: 'admin@example.com',
    is_admin: true,
    is_master: true,
    school: 'Test School',
    id: '1234',
    allow_email: true,
    allow_push: false,
};
(useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });

// Mock router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

// Check text function
function checkText(text: string) {
    return text;
}

// Tests
describe('Profile', () => {
    // Web Page Info for Testing
    let updateUserInfo: jest.Mock;
    let router: { replace: jest.Mock; push: jest.Mock };

    // Setup Mock data before and clear up after testing
    beforeEach(() => {
        updateUserInfo = jest.fn();
        router = { replace: jest.fn(), push: jest.fn() };
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser, updateUserInfo });
        (useRouter as jest.Mock).mockReturnValue(router);
        jest.spyOn(Alert, 'alert');
        jest.spyOn(global, 'fetch');
        // Setup PUT API

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Base Regular User Profile Page
    test('Regular User Profile Page Renders', () => {
        // Setup normal user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser });
        // Render page
        const { getByText, getByTestId } = render(<Profile />);
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy(); // text is part of HeaderInputText, so the user's name would render too technically, could be disable b/c of isEditing variable
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        //expect(getByText('Update Info')).toHaveProp('CustomButton', CustomEditIcon);
        // editicon = function customediticon
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();

    });

    // Base Master User Profile Page
    // Only difference is the Invite User button
    test('Admin Master Page Renders', () => {
        // Render Admin User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        // Render page
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


    // Edit Page: Simulate Edit button click and Update Info button for User
    test('User Edit Info Page Renders with Blue Edit and Update Info Buttons', () => {
        // Render User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser })

        const { getByText, getByTestId } = render(<Profile />);
        // Simulate Edit Text being clicked
        fireEvent.press(getByText('Edit'));
        // Confirm page changed
        expect(getByTestId('editButton')).toHaveTextContent('Cancel Edit'); // The blue Edit text
        expect(getByText('Finish Updating')).toBeTruthy();
        let updateText = screen.getAllByText('Cancel Edit')[1]; // Check the 2nd 'Cancel Edit' text in the custom button
        expect(updateText).toBeTruthy;

        // Revert to based page by clicking Edit text again
        fireEvent.press(getByTestId('editButton')); // Get the blue text 

        // Check if base profile page renders back
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();


        // Check the Update Info button
        // Simulate Update Info button being clicked
        fireEvent.press(getByText('Update Info'));
        // Confirm page changed
        expect(getByTestId('editButton')).toHaveTextContent('Cancel Edit'); // The blue Edit text
        expect(getByText('Finish Updating')).toBeTruthy();
        let updateText2 = screen.getAllByText('Cancel Edit')[1]; // Check the 2nd 'Cancel Edit' text in the custom button
        expect(updateText2).toBeTruthy;

        // Revert to based page by clicking Edit text again
        fireEvent.press(updateText2); // Click the Cancel Edit button 

        // Check if base profile page renders back
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();

    });

    // Edit Page: Simulate Edit button click and Update Info button for Master
    test('Master Edit Info Page Renders with Blue Edit Text', () => {
        // Render User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });

        const { getByText, getByTestId } = render(<Profile />);
        // Simulate Edit Text being clicked
        fireEvent.press(getByText('Edit'));
        // Confirm page changed
        expect(getByTestId('editButton')).toHaveTextContent('Cancel Edit');
        expect(getByText('Finish Updating')).toBeTruthy();
        let updateText = screen.getAllByText('Cancel Edit')[1]; // Get the 2nd 'Cancel Edit' text in the custom button
        expect(updateText).toBeTruthy;

        // Revert to based page by clicking Edit text again
        fireEvent.press(getByTestId('editButton')); // Get the blue text 

        // Check if base profile page renders back
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

        // Check the Update Info button
        // Simulate Update Info button being clicked
        fireEvent.press(getByText('Update Info'));
        // Confirm page changed
        expect(getByTestId('editButton')).toHaveTextContent('Cancel Edit'); // The blue Edit text
        expect(getByText('Finish Updating')).toBeTruthy();
        let updateText2 = screen.getAllByText('Cancel Edit')[1]; // Check the 2nd 'Cancel Edit' text in the custom button
        expect(updateText2).toBeTruthy;

        // Revert to based page by clicking Edit text again
        fireEvent.press(updateText2); // Click the Cancel Edit button 

        // Check if base profile page renders back
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

    // Test for Updating Name and Email Info Information
    test('Update Info Buttons Works for User', async () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster, updateUserInfo });
        // Setup fetch response for Name and Email after change
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        user: {
                            first: 'New',
                            last: 'Regular',
                            email: 'regular@example.com',
                            is_admin: true,
                            is_master: true,
                            school: 'Test School',
                            id: '1234',
                        },
                    }),
            })
        ) as jest.Mock;

        const { getByText, getByTestId, queryByText } = render(<Profile />);
        // Simulate Update Info button being pressed
        fireEvent.press(getByText('Update Info'));

        // Simulate Name and email changes
        fireEvent.changeText(queryByText('Name'), 'New Regular');
        fireEvent.changeText(queryByText('Email'), 'regular@example.com');

        // Confirm Changes with button click
        fireEvent.press(queryByText('Finish Updating'));

        // Confirm PUT API worked
        await waitFor(() => {
            // Ensure user context is updated with correct data
            expect(updateUserInfo).toHaveBeenCalledWith({
                ...mockMaster,
                name: 'New Regular',
                email: 'regular@example.com',
            });
        });


        // Check if base profile page renders back with new Name and Email
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('avatarFrame')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Invite User')).toBeTruthy();
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();
    });
    // Alerts for Incorrect Info when Updating Info
    // 3 cases: No name, no email, 1 word for name
    test('Alert for Updating Info Incorrectly for No name', () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });

        const { getByText, getByTestId, queryByText } = render(<Profile />);
        // Simulate Update Info button being pressed
        fireEvent.press(getByText('Update Info'));

        // Simulate Name changes
        fireEvent.changeText(queryByText('Name'), 'OnlyOneWord');
        // Confirm Alert
        fireEvent.press(queryByText('Finish Updating'));
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');

    });
    test('Alert for Updating Info Incorrectly for No Email', () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId, queryByText } = render(<Profile />);
        // Simulate Update Info button being pressed
        fireEvent.press(getByText('Update Info'));
        // Simulate No email
        fireEvent.changeText(queryByText('Email'), '');
        // Confirm Alert
        fireEvent.press(queryByText('Finish Updating'));
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');

    });
    test('Alert for Updating Info Incorrectly for No Name and Email', () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId, queryByText } = render(<Profile />);
        // Simulate Update Info button being pressed
        fireEvent.press(getByText('Update Info'));

        // Simulate Name changes
        fireEvent.changeText(queryByText('Name'), '');
        fireEvent.changeText(queryByText('Email'), '');
        // Confirm Alert
        fireEvent.press(queryByText('Finish Updating'));
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');

    });

    // Routing
    test('Routing for Master User to Invite User page', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        // Simulate button clicks
        fireEvent.press(getByText('Invite User'));
        expect(router.push).toHaveBeenCalledWith('/profile/userPage');

    });
    test('Routing for User to Notifications page', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        // Simulate button clicks
        fireEvent.press(getByText('Notifications'));
        expect(router.push).toHaveBeenCalledWith('/profile/notifications');

    });
    test('Routing for User to Reset Password page', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        // Simulate button clicks
        fireEvent.press(getByText('Reset Password'));
        expect(router.push).toHaveBeenCalledWith('/profile/resetPassword');
    });
    test('Routing for User to Log Out', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        // Simulate button clicks
        fireEvent.press(getByText('Log Out'));
        fireEvent.press(getByText('Yes'));
        expect(router.push).toHaveBeenCalledWith('/(auth)/login');
        // (auth)/login
    });

    // Logout UI
    test('Logout Modal Renders for Master', () => {
        // Setup master user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, queryByText } = render(<Profile />);
        // Simulate Log out clicks
        fireEvent.press(getByText('Log Out'));
        expect(getByText('Are you sure you want to log out?')).toBeOnTheScreen();
        expect(getByText('Yes')).toBeOnTheScreen();
        expect(getByText('Cancel')).toBeOnTheScreen();
        // Decline to go back to profile
        fireEvent.press(getByText('Cancel'));
        // Check modal is gone
        expect(queryByText('Are you sure you want to log out?')).not.toBeOnTheScreen();
        expect(queryByText('Yes')).not.toBeOnTheScreen();
        expect(queryByText('Cancel')).not.toBeOnTheScreen();

    });
    test('Logout Modal Renders for Regular User', () => {
        // Setup master user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser });
        const { getByText, queryByText } = render(<Profile />);
        // Simulate Log out clicks
        fireEvent.press(getByText('Log Out'));
        expect(getByText('Are you sure you want to log out?')).toBeOnTheScreen();
        expect(getByText('Yes')).toBeOnTheScreen();
        expect(getByText('Cancel')).toBeOnTheScreen();
        // Decline to go back to profile
        fireEvent.press(getByText('Cancel'));
        // Check modal is gone
        expect(queryByText('Are you sure you want to log out?')).not.toBeOnTheScreen();
        expect(queryByText('Yes')).not.toBeOnTheScreen();
        expect(queryByText('Cancel')).not.toBeOnTheScreen();

    });

});
