import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '@/app/(auth)/login';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mocking dependencies to control their behavior during tests
jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  let updateUserInfo: jest.Mock;
  let router: { replace: jest.Mock; push: jest.Mock };

  beforeEach(() => {
    // Mocking functions for user context and navigation
    updateUserInfo = jest.fn();
    router = { replace: jest.fn(), push: jest.fn() };
    (useUser as jest.Mock).mockReturnValue({ updateUserInfo });
    (useRouter as jest.Mock).mockReturnValue(router);
    jest.spyOn(Alert, 'alert'); // Mock Alert.alert to prevent actual alerts during tests
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test to prevent test contamination
  });

  test('renders login page elements correctly', () => {
    // Render the login page component
    const { getByText, getByTestId } = render(<LoginPage />);

    // Ensure all expected elements are present in the UI
    expect(getByText('ChemTrack')).toBeTruthy();
    expect(getByText('A chemical inventory manager with QR code scanning built for schools.')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Log In')).toBeTruthy();
    expect(getByText("Don't have an account? Sign-up")).toBeTruthy();
  });

  test('shows alert when login button is pressed with invalid email or password', async () => {
    const { getByText } = render(<LoginPage />);
    
    fireEvent.press(getByText('Log In')); // Simulate pressing the login button without input
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Please enter a valid email and password');
    });
  });

  test('successful login updates user context and navigates', async () => {
    // Mock API response for a successful login
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              first: 'John',
              last: 'Doe',
              email: 'johndoe@example.com',
              is_admin: false,
              is_master: false,
              school: 'Test School',
              id: '12345',
            },
          }),
      })
    ) as jest.Mock;

    const { getByTestId, getByText } = render(<LoginPage />);

    // Simulate user input and login button press
    fireEvent.changeText(getByTestId('email-input'), 'johndoe@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      // Ensure user context is updated with correct data
      expect(updateUserInfo).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@example.com',
        is_admin: false,
        is_master: false,
        school: 'Test School',
        id: '12345',
      });
      // Ensure navigation occurs to the main application
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('handles login failure with an alert', async () => {
    // Mock API response for failed login attempt
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })
    ) as jest.Mock;
    
    const { getByTestId, getByText } = render(<LoginPage />);
    
    // Simulate incorrect user credentials
    fireEvent.changeText(getByTestId('email-input'), 'wrong@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrongpassword');
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      // Ensure alert is displayed with error message
      expect(Alert.alert).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
