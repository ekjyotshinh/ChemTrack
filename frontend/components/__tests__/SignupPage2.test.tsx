import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SignUpPage2 from '@/app/(auth)/signupPage2';
import { Alert } from 'react-native';
import '@testing-library/jest-native/extend-expect';

// Define interfaces for component props
interface BlueHeaderProps {
  headerText: string;
  onPress: () => void;
}

interface HeaderTextInputProps {
  headerText: string;
  value: string;
  onChangeText: (text: string) => void;
  hasIcon?: boolean;
}

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color: string;
  textColor: string;
  iconPosition?: string;
  icon?: React.ReactNode;
  width?: number;
}

// Create mock functions for router
const mockPush = jest.fn();
const mockReplace = jest.fn();

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({
    email: 'test@example.com',
    password: 'password123',
    selectedSchool: 'Test School',
  }),
}));

// Mock the user context
const mockUpdateUserInfo = jest.fn();
jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    updateUserInfo: mockUpdateUserInfo,
  }),
}));

// Mock fetch function
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ user: { id: '123' } }),
  }) as unknown as Promise<Response>
);

// Add properly typed props collection arrays
const blueHeaderProps: BlueHeaderProps[] = [];
jest.mock('@/components/BlueHeader', () => {
  return function MockBlueHeader(props: BlueHeaderProps) {
    blueHeaderProps.push(props);
    return null;
  };
});

const headerTextInputProps: HeaderTextInputProps[] = [];
jest.mock('@/components/inputFields/HeaderTextInput', () => {
  return function MockHeaderTextInput(props: HeaderTextInputProps) {
    headerTextInputProps.push(props);
    return null;
  };
});

const customButtonProps: CustomButtonProps[] = [];
jest.mock('@/components/CustomButton', () => {
  return function MockCustomButton(props: CustomButtonProps) {
    customButtonProps.push(props);
    return null;
  };
});

// Mock Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null
}));

// Mock constants
jest.mock('@/constants/Size', () => ({
  height: jest.fn((val: number) => val),
  width: jest.fn((val: number) => val)
}));

jest.mock('@/constants/Colors', () => ({
  white: '#FFFFFF',
  blue: '#007BFF',
  grey: '#AAAAAA',
  offwhite: '#F5F5F5'
}));

describe('SignUpPage2 Screen', () => {
  // Clear all mocks and arrays before each test
  beforeEach(() => {
    jest.clearAllMocks();
    blueHeaderProps.length = 0;
    headerTextInputProps.length = 0;
    customButtonProps.length = 0;
    
    // Default fetch mock response for successful API call
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        user: {
          id: '123',
        },
      }),
    });
  });

  // Test 1: Component renders without crashing
  it('renders without crashing', async () => {
    const component = render(<SignUpPage2 />);
    expect(component).toBeTruthy();
  });

  // Test 2: BlueHeader component receives correct props
  it('passes correct header props to BlueHeader', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(blueHeaderProps.length).toBeGreaterThan(0);
    });
    
    // Check its props
    const props = blueHeaderProps[0];
    expect(props.headerText).toBe('Sign Up');
    expect(typeof props.onPress).toBe('function');
  });

  // Test 3: Back button navigation
  it('navigates to signupPage1 when back button is pressed', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(blueHeaderProps.length).toBeGreaterThan(0);
    });
    
    // Get the onPress handler from the BlueHeader props
    const backHandler = blueHeaderProps[0].onPress;
    
    // Call the handler to simulate pressing back
    backHandler();
    
    // Verify navigation occurred
    expect(mockPush).toHaveBeenCalledWith('/signupPage1');
  });

  // Test 4: First Name input receives correct props
  it('passes correct props to first name input', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(headerTextInputProps.length).toBeGreaterThan(0);
    });
    
    // Find first name input
    const firstNameInput = headerTextInputProps.find(p => p.headerText === 'First Name');
    expect(firstNameInput).toBeTruthy();
    if (firstNameInput) {
      expect(firstNameInput.hasIcon).toBe(true);
      expect(typeof firstNameInput.onChangeText).toBe('function');
    }
  });
  
  // Test 5: Last Name input receives correct props
  it('passes correct props to last name input', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(headerTextInputProps.length).toBeGreaterThan(0);
    });
    
    // Find last name input
    const lastNameInput = headerTextInputProps.find(p => p.headerText === 'Last Name');
    expect(lastNameInput).toBeTruthy();
    if (lastNameInput) {
      expect(lastNameInput.hasIcon).toBe(true);
      expect(typeof lastNameInput.onChangeText).toBe('function');
    }
  });

  // Test 6: Create Account button initial state
  it('renders Create Account button with correct initial disabled state', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(customButtonProps.length).toBeGreaterThan(0);
    });
    
    // Check Create Account button
    const buttonProps = customButtonProps[0];
    
    // Verify button properties
    expect(buttonProps.title).toBe('Create Account');
    expect(buttonProps.iconPosition).toBe('right');
    expect(buttonProps.width).toBe(337);
    
    // Button should be disabled initially (white/grey)
    expect(buttonProps.color).toBe('#FFFFFF');
    expect(buttonProps.textColor).toBe('#AAAAAA');
  });

  // these test cases should be updated, the user should only be able to create and account after tehy have filled out the first anmea nd the last name
  /* 

  // Test 7: Successful account creation
  it('handles successful account creation correctly', async () => {
    render(<SignUpPage2 />);
    
    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(customButtonProps.length).toBeGreaterThan(0);
    });
    
    // Access the onPress handler for the Create Account button
    const createAccountHandler = customButtonProps[0].onPress;
    
    // Call the handler to simulate button press
    await createAccountHandler();
    
    // Verify API call was made with correct data
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/users'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      })
    );
    
    // Check that the user context was updated
    expect(mockUpdateUserInfo).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
      is_admin: false,
      is_master: false,
      school: 'Test School',
      id: '123',
    }));
    
    // Verify navigation to tabs route
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  // Test 8: Failed account creation due to API error
  it('handles API error during account creation', async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    
    render(<SignUpPage2 />);
    
    // Wait for component rendering
    await waitFor(() => {
      expect(customButtonProps.length).toBeGreaterThan(0);
    });
    
    // Get Create Account button handler
    const createAccountHandler = customButtonProps[0].onPress;
    
    // Simulate button press
    await createAccountHandler();
    
    // Verify Alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error creating Account!');
    
    // Verify navigation back to first signup page
    expect(mockPush).toHaveBeenCalledWith('/signupPage1');
  });

  // Test 9: Failed account creation due to network error
  it('handles network error during account creation', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<SignUpPage2 />);
    
    // Wait for component rendering
    await waitFor(() => {
      expect(customButtonProps.length).toBeGreaterThan(0);
    });
    
    // Get Create Account button handler
    const createAccountHandler = customButtonProps[0].onPress;
    
    // Simulate button press
    await createAccountHandler();
    
    // Verify Alert was called
    expect(Alert.alert).toHaveBeenCalledWith('Error creating Account!');
    
    // Verify navigation back to first signup page
    expect(mockPush).toHaveBeenCalledWith('/signupPage1');
  });

  */

  // Test 10: Test if props collection works correctly for all components
  it('collects props from all rendered components', async () => {
    render(<SignUpPage2 />);
    
    // Wait for all components to be rendered
    await waitFor(() => {
      expect(blueHeaderProps.length).toBeGreaterThan(0);
      expect(headerTextInputProps.length).toBeGreaterThan(0);
      expect(customButtonProps.length).toBeGreaterThan(0);
    });
    
    // Verify we collected props from all expected components
    expect(headerTextInputProps.length).toBe(2); // First Name and Last Name
    expect(customButtonProps.length).toBe(1);    // Create Account button
  });
});