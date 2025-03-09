// Master Profile Page
/*
UI parts:
header (My Account): colors, font, font family, location
pic: Currently just intials and "box"
edit text (changeable: check functions)
name
email
update Info (switch to finish update and cancel update)
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

import { render, fireEvent, screen, waitFor, getQueriesForElement } from '@testing-library/react-native';


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
// Note: note apis: POST and user context
/*
Test ids:
    Name input
    email input
*/


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

const mockUser: UserInfo = {
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

const mockMaster: UserInfo = {
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
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster })

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
    test('Update Info for Regular User Properly', async () => {
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
                            is_admin: false,
                            is_master: false,
                            school: 'Test School',
                            id: '123',
                        },
                    }),
            })
        ) as jest.Mock;

        const { getByText, getByTestId } = render(<Profile />);
        // Simulate Update Info button being pressed
        fireEvent.press(getByText('Update Info'));
        // Check screen renders
        expect(getByTestId('editButton')).toHaveTextContent('Cancel Edit');
        expect(getByText('Finish Updating')).toBeTruthy();
        let updateText = screen.getAllByText('Cancel Edit')[1]; // Get the 2nd 'Cancel Edit' text in the custom button
        expect(updateText).toBeTruthy;
        // Simulate Name and email changes
        fireEvent.changeText(getByText('Name'), 'New Regular');
        fireEvent.changeText(getByText('Email'), 'regular@example.com');

        // Confirm Changes with button click
        fireEvent.press(getByText('Finish Updating'));

        // Confirm PUT API worked
        await waitFor(() => {
            // Ensure user context is updated with correct data
            expect(updateUserInfo).toHaveBeenCalledWith({
                name: 'New Regular',
                email: 'regular@example.com',
                is_admin: false,
                is_master: false,
                school: 'Test School',
                id: '123',
            });
        });

        // Check if base profile page renders back with new Name and Email
        expect(getByText('My Account')).toBeTruthy();
        expect(getByTestId('initialsInput')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Name')).toHaveDisplayValue('New Regular');
        expect(getByText('Email')).toHaveDisplayValue('regular@example.com');
        expect(getByText('Update Info')).toBeTruthy();
        expect(getByText('Notifications')).toBeTruthy();
        expect(getByText('Reset Password')).toBeTruthy();
        expect(getByText('Log Out')).toBeTruthy();

    });

    //test('Alert for Updating Info for Regular User Incorrectly', () => { });
    /*
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
