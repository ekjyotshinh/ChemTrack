import React from 'react';
import { render } from '@testing-library/react-native';
import NewPassword from '@/app/(tabs)/profile/newPassword';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useUser } from '@/contexts/UserContext';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({
    resetToken: 'test-token',
  })),
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
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock the fetch API to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  it('renders without crashing', () => {
    // Just verify that the component renders without throwing an error
    const { getAllByText } = render(<NewPassword />);
    expect(getAllByText(/Reset/i).length).toBeGreaterThan(0);
  });
});
