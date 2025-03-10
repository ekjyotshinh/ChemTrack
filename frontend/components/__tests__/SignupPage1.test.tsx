import React from 'react';
import { render, act } from '@testing-library/react-native';
import SignUpPage from '@/app/(auth)/signupPage1';

// Define interfaces for component props
interface BlueHeaderProps {
  headerText: string;
  onPress: () => void;
}

interface HeaderTextInputProps {
  headerText: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
  autoCapitalize?: string;
  hasIcon?: boolean;
  secureTextEntry?: boolean;
}

interface DropdownInputProps {
  data: Array<{ label: string; value: string }>;
  value: string;
  setValue: (value: string) => void;
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

interface CustomTextHeaderProps {
  headerText: string;
}

// Create a mockPush function we can monitor
const mockPush = jest.fn();

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock emailRegex to be a no-op to prevent infinite renders
jest.mock('@/functions/EmailRegex', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

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

const dropdownInputProps: DropdownInputProps[] = [];
jest.mock('@/components/inputFields/DropdownInput', () => {
  return function MockDropdownInput(props: DropdownInputProps) {
    dropdownInputProps.push(props);
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

const customTextHeaderProps: CustomTextHeaderProps[] = [];
jest.mock('@/components/inputFields/CustomTextHeader', () => {
  return function MockCustomTextHeader(props: CustomTextHeaderProps) {
    customTextHeaderProps.push(props);
    return null;
  };
});

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

describe('SignUpPage Screen', () => {
  // Clear all mocks and arrays before each test
  beforeEach(() => {
    mockPush.mockClear();
    blueHeaderProps.length = 0;
    headerTextInputProps.length = 0;
    dropdownInputProps.length = 0;
    customButtonProps.length = 0;
    customTextHeaderProps.length = 0;
  });

  // Test 1: Component renders without crashing
  it('renders without crashing', () => {
    const rendered = render(<SignUpPage />);
    expect(rendered).toBeTruthy();
  });

  // Test 2: BlueHeader component receives correct props
  it('passes correct header props to BlueHeader', () => {
    render(<SignUpPage />);
    
    // There should be 1 BlueHeader component
    expect(blueHeaderProps.length).toBe(1);
    
    // Check its props
    const props = blueHeaderProps[0];
    expect(props.headerText).toBe('Sign Up');
    expect(typeof props.onPress).toBe('function');
  });

  // Test 3: Back button navigation
  it('navigates to login when back button is pressed', () => {
    render(<SignUpPage />);
    
    // Get the onPress handler from the BlueHeader props
    const backHandler = blueHeaderProps[0].onPress;
    
    // Call the handler to simulate pressing back
    act(() => {
      backHandler();
    });
    
    // Verify navigation occurred
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  // Test 4: Email input receives correct props
  it('passes correct props to email input', () => {
    render(<SignUpPage />);
    
    // Find email input
    const emailInput = headerTextInputProps.find(p => p.headerText === 'Email');
    expect(emailInput).toBeTruthy();
    if (emailInput) {
      expect(emailInput.keyboardType).toBe('email-address');
      expect(emailInput.autoCapitalize).toBe('none');
      expect(emailInput.hasIcon).toBe(true);
      expect(typeof emailInput.onChangeText).toBe('function');
    }
  });
  
  // Test 5: Password input receives correct props
  it('passes correct props to password input', () => {
    render(<SignUpPage />);
    
    // Find password input
    const passwordInput = headerTextInputProps.find(p => p.headerText === 'Password');
    expect(passwordInput).toBeTruthy();
    if (passwordInput) {
      expect(passwordInput.secureTextEntry).toBe(true);
      expect(passwordInput.autoCapitalize).toBe('none');
      expect(passwordInput.hasIcon).toBe(true);
      expect(typeof passwordInput.onChangeText).toBe('function');
    }
  });

  // Test 6: School dropdown receives correct data
  it('passes correct data to school dropdown', () => {
    render(<SignUpPage />);
    
    // Check CustomTextHeader for School
    const schoolHeader = customTextHeaderProps.find(p => p.headerText === 'School');
    expect(schoolHeader).toBeTruthy();
    
    // Check dropdown props
    expect(dropdownInputProps.length).toBe(1);
    const dropdown = dropdownInputProps[0];
    
    // Verify schools data matches expected array
    expect(dropdown.data).toEqual([
      { label: 'Encina High School', value: 'Encina High School' },
      { label: 'Sacramento High School', value: 'Sacramento High School' },
      { label: 'Foothill High School', value: 'Foothill High School' },
      { label: 'Grant Union High School', value: 'Grant Union High School' },
    ]);
    
    // Check setValue handler
    expect(typeof dropdown.setValue).toBe('function');
  });

  // Test 7: Next button initial state
  it('renders Next button with correct initial disabled state', () => {
    render(<SignUpPage />);
    
    // Check Next button
    expect(customButtonProps.length).toBe(1);
    const buttonProps = customButtonProps[0];
    
    // Verify button properties
    expect(buttonProps.title).toBe('Next');
    expect(buttonProps.iconPosition).toBe('right');
    expect(buttonProps.width).toBe(337);
    
    // Button should be disabled initially (white/grey)
    expect(buttonProps.color).toBe('#FFFFFF');
    expect(buttonProps.textColor).toBe('#AAAAAA');
  });

  // Test 8: Next button press navigates to next page
  it('navigates to signupPage2 with form data when Next button is pressed', () => {
    render(<SignUpPage />);
    
    // Get Next button handler
    const nextButton = customButtonProps[0];
    
    // Call the handler to simulate button press
    act(() => {
      nextButton.onPress();
    });
    
    // Check navigation occurred with right pathname and params structure
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/signupPage2',
      params: expect.objectContaining({
        email: expect.any(String),
        password: expect.any(String),
        selectedSchool: expect.any(String)
      })
    });
  });

  // Test 9: Test if props collection works correctly for all components
  it('collects props from all rendered components', () => {
    render(<SignUpPage />);
    
    // Verify we collected props from all expected components
    expect(blueHeaderProps.length).toBe(1);
    expect(headerTextInputProps.length).toBe(2); // Email and Password
    expect(customTextHeaderProps.length).toBe(1); // School header
    expect(dropdownInputProps.length).toBe(1);
    expect(customButtonProps.length).toBe(1);
  });
});