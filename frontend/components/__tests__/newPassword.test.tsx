import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import NewPassword from '@/app/(tabs)/profile/newPassword';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useUser } from '@/contexts/UserContext';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the UserContext
jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock expo-font to prevent font loading errors in tests
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock @expo/vector-icons to bypass actual icon rendering
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text {...props}>{props.name}</Text>,
    FontAwesome: (props: any) => <Text {...props}>{props.name}</Text>,
  };
});

// Spy on Alert
jest.spyOn(Alert, 'alert');

describe('NewPassword Screen', () => {
  const mockRouterPush = jest.fn();
  const mockUserInfo = { id: '12345' };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useUser as jest.Mock).mockReturnValue({ userInfo: mockUserInfo });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ... Other tests remain unchanged

  it('makes an API call and navigates on successful password change', async () => {
    // Mock the fetch API to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<NewPassword />);

    // Fill in inputs with matching values
    fireEvent.changeText(screen.getByTestId('new-password-input'), 'password123');
    fireEvent.changeText(screen.getByTestId('confirm-password-input'), 'password123');

    // Press the button
    fireEvent.press(screen.getByText('Change Password'));

    // Wait for the API call to complete and success alert to be shown
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/users/12345'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ Password: 'password123' }),
        })
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Password changed successfully.',
        expect.any(Array)
      );
    });

    // Retrieve the "OK" button callback from the alert parameters
    const alertCall = (Alert.alert as jest.Mock).mock.calls.find(call => call[0] === 'Success');
    const buttonCallbacks = alertCall ? alertCall[2] : [];
    const okButton = buttonCallbacks.find((btn: { text: string; onPress: Function }) => btn.text === 'OK');
    // Simulate pressing the "OK" button
    if (okButton && okButton.onPress) {
      okButton.onPress();
    }

    // Now assert that router.push has been called correctly
    expect(mockRouterPush).toHaveBeenCalledWith('/profile/profile');
  });
});