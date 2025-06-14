import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Profile from '@/app/(tabs)/profile/profile';
import { useUser } from '@/contexts/UserContext';
import { render, fireEvent, waitFor } from '@testing-library/react-native';


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

// Simulate pressing buttons inside an alert
const simulateAlertPress = (buttonText: string) => {
    jest.spyOn(Alert, 'alert').mockImplementation((_, __, buttons) => {
        const yesButton = buttons?.find((btn) => btn.text === buttonText);
        yesButton?.onPress?.();
    });
};

// Tests
describe('Profile', () => {
    // Web Page Info for Testing
    let updateUserInfo: jest.Mock;
    let router: { replace: jest.Mock; push: jest.Mock };
    const mockProfilePictureURL = 'https://example.com/avatar.png';

    // Setup Mock data before and clear up after testing
    beforeEach(() => {
        updateUserInfo = jest.fn();
        router = { replace: jest.fn(), push: jest.fn() };
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser, updateUserInfo });
        (useRouter as jest.Mock).mockReturnValue(router);
        jest.spyOn(Alert, 'alert');
        jest.spyOn(global, 'fetch');


        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ profilePictureURL: mockProfilePictureURL }),
            })
        ) as jest.Mock;

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Base Regular User Profile Page
    test('Regular User Profile Page Renders', async () => {
        // Setup normal user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser });
        // Render page
        const { getByText, getByTestId } = render(<Profile />);
        await waitFor(() => {
            expect(getByText('My Account')).toBeTruthy();
            expect(getByTestId('initialsInput')).toBeTruthy();
            expect(getByText('Edit')).toBeTruthy();
            expect(getByText('Name')).toBeTruthy(); // text is part of HeaderInputText, so the user's name would render too technically, could be disable b/c of isEditing variable
            expect(getByText('Email')).toBeTruthy();
            expect(getByText('Update Info')).toBeTruthy();
            expect(getByText('Notifications')).toBeTruthy();
            expect(getByText('Reset Password')).toBeTruthy();
            expect(getByText('Log Out')).toBeTruthy();
        });

    });

    // Base Master User Profile Page
    // Only difference is the Invite User button
    test('Admin Master Page Renders', async () => {
        // Render Admin User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        // Render page
        const { getByText, getByTestId } = render(<Profile />);
        await waitFor(() => {
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

    });


    // Edit Page: Simulate Update Info button for User
    test('User Edit Info Page Renders with Update Info Button', async () => {
        // Render User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser })

        const { getByText, getByTestId } = render(<Profile />);
        await waitFor(() => {
            // Check the Update Info button
            // Simulate Update Info button being clicked
            fireEvent.press(getByText('Update Info'));
            // Confirm page changed
            expect(getByText('Finish Updating')).toBeTruthy();
            expect(getByText('Cancel Edit')).toBeTruthy();

            // Revert to based page by clicking Cancel Edit
            fireEvent.press(getByText('Cancel Edit')); // Click the Cancel Edit button 

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
    });

    // Edit Page: Simulate Edit button click and Update Info button for Master
    test('Master User Edit Info Page Renders with Update Info Button', async () => {
        // Render User
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });

        const { getByText, getByTestId } = render(<Profile />);
        await waitFor(() => {
            // Check the Update Info button
            // Simulate Update Info button being clicked
            fireEvent.press(getByText('Update Info'));
            // Confirm page changed
            expect(getByText('Finish Updating')).toBeTruthy();
            expect(getByText('Cancel Edit')).toBeTruthy();

            // Revert to based page by clicking Cancel Edit
            fireEvent.press(getByText('Cancel Edit')); // Click the Cancel Edit button 

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

        await waitFor(async () => {
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
    });
    // Alerts for Incorrect Info when Updating Info
    // 3 cases: No name, no email, 1 word for name
    test('Alert for Updating Info Incorrectly for No name', async () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });

        const { getByText, getByTestId, queryByText } = render(<Profile />);
        await waitFor(async () => {
            // Simulate Update Info button being pressed
            fireEvent.press(getByText('Update Info'));

            // Simulate Name changes
            fireEvent.changeText(queryByText('Name'), 'OnlyOneWord');
            // Confirm Alert
            fireEvent.press(queryByText('Finish Updating'));
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');
        });
    });

    test('Alert for Updating Info Incorrectly for No Email', async () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId, queryByText } = render(<Profile />);
        await waitFor(async () => {
            // Simulate Update Info button being pressed
            fireEvent.press(getByText('Update Info'));
            // Simulate No email
            fireEvent.changeText(queryByText('Email'), '');
            // Confirm Alert
            fireEvent.press(queryByText('Finish Updating'));
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');
        });

    });

    test('Alert for Updating Info Incorrectly for No Name and Email', async () => {
        // Setup regular user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId, queryByText } = render(<Profile />);

        await waitFor(async () => {
            // Simulate Update Info button being pressed
            fireEvent.press(getByText('Update Info'));

            // Simulate Name changes
            fireEvent.changeText(queryByText('Name'), '');
            fireEvent.changeText(queryByText('Email'), '');
            // Confirm Alert
            fireEvent.press(queryByText('Finish Updating'));
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields with valid information');
        });

    });

    // Routing
    test('Routing for Master User to Invite User page', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        await waitFor(async () => {
            // Simulate button clicks
            await waitFor(async () => {
                fireEvent.press(getByText('Invite User'));
                expect(router.push).toHaveBeenCalledWith('/profile/userPage');
            });
        });
    });

    test('Routing for User to Notifications page', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        await waitFor(async () => {
            // Simulate button clicks
            fireEvent.press(getByText('Notifications'));
            expect(router.push).toHaveBeenCalledWith('/profile/notifications');
        });

    });

    test('Routing for User to Reset Password page', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);
        await waitFor(async () => {
            // Simulate button clicks
            fireEvent.press(getByText('Reset Password'));
            expect(router.push).toHaveBeenCalledWith('/profile/newPassword');
        });
    });

    test('Routing for User to Log Out', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);

        // Simulate pressing yes on alert
        simulateAlertPress('Yes');

        await waitFor(async () => {
            // Simulate button clicks
            fireEvent.press(getByText('Log Out'));
            expect(Alert.alert).toHaveBeenCalledWith('Log Out', 'Are you sure you want to log out?', expect.any(Array));
            expect(router.replace).toHaveBeenCalledWith('/(auth)/login');
        });
    });

    // Logout UI
    test('Logout Modal Renders for Master', async () => {
        // Setup master user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<Profile />);

        // Simulate pressing no on alert
        simulateAlertPress('No');

        await waitFor(async () => {
            // Simulate Log out clicks
            fireEvent.press(getByText('Log Out'));

            // Decline to go back to profile
            expect(Alert.alert).toHaveBeenCalledWith('Log Out', 'Are you sure you want to log out?', expect.any(Array));

            // No navigation to login page
            expect(router.replace).not.toHaveBeenCalled();
        });
    });

    test('Logout Modal Renders for Regular User', async () => {
        // Setup master user
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockUser });
        const { getByText } = render(<Profile />);

        // Simulate pressing no on alert
        simulateAlertPress('No');

        await waitFor(async () => {
            // Simulate Log out clicks
            fireEvent.press(getByText('Log Out'));

            // Decline to go back to profile
            expect(Alert.alert).toHaveBeenCalledWith('Log Out', 'Are you sure you want to log out?', expect.any(Array));

            // No navigation to login page
            expect(router.replace).not.toHaveBeenCalled();
        });
    });

});
