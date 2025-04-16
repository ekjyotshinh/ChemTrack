import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SignUpPage from '@/app/(auth)/customSignup1';

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
editable?: boolean;

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

// Create a mockPush function we can monitor
const mockPush = jest.fn();

// Mock the router
jest.mock('expo-router', () => ({
useRouter: () => ({
	push: mockPush,
}),
useLocalSearchParams: () => ({
	email: 'testuser@example.com',
	userType: 'master',
	school: 'Sacramento High School',
	isMaster: "true", 
	isAdmin: "false",
	id: 'user123',
}),
}));

// Collect component props for assertions
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

describe('customSignup1 Screen', () => {
	// Clear all mocks before each test
	// Setup mocks before each test
	beforeEach(() => {
		// 👇 Add this block to mock the fetch API
		global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({
			email: 'testuser@example.com',
			is_master: true,
			is_admin: false,
			school: 'Mock School',
			}),
		})
		) as jest.Mock;

		mockPush.mockClear();
		blueHeaderProps.length = 0;
		headerTextInputProps.length = 0;
		customButtonProps.length = 0;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	// Test 1: Component renders without crashing
	it('renders without crashing', async () => {
		const component = render(<SignUpPage />);
		expect(component).toBeTruthy();
	});

	// Test 2: BlueHeader component receives correct props
	it('passes correct header props to BlueHeader', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(blueHeaderProps.length).toBeGreaterThan(0);
		});

		const props = blueHeaderProps[0];
		expect(props.headerText).toBe('Sign Up');
		expect(typeof props.onPress).toBe('function');
	});

	// Test 3: Back button navigation
	it('navigates to login when back button is pressed', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(blueHeaderProps.length).toBeGreaterThan(0);
		});

		const backHandler = blueHeaderProps[0].onPress;
		backHandler();
		
		expect(mockPush).toHaveBeenCalledWith('/login');
	});

	// Test 4: Email input receives correct props
	it('passes correct props to email input', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(headerTextInputProps.length).toBeGreaterThan(0);
		});

		const emailInput = headerTextInputProps.find(p => p.headerText === 'Email');
		expect(emailInput).toBeTruthy();
		if (emailInput) {
		expect(emailInput.hasIcon).toBe(false);
		expect(emailInput.editable).toBe(false);
		expect(typeof emailInput.onChangeText).toBe('function');
		}
	});

	// Test 5: User Type input receives correct props
	it('passes correct props to User Type input', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(headerTextInputProps.length).toBeGreaterThan(0);
		});

		const userTypeInput = headerTextInputProps.find(p => p.headerText === 'User Type');
		expect(userTypeInput).toBeTruthy();
		if (userTypeInput) {
		expect(userTypeInput.hasIcon).toBe(false);
		expect(userTypeInput.editable).toBe(false);
		expect(typeof userTypeInput.onChangeText).toBe('function');
		}
	});

	// Test 6: Password input receives correct props
	it('passes correct props to password input', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(headerTextInputProps.length).toBeGreaterThan(0);
		});

		const passwordInput = headerTextInputProps.find(p => p.headerText === 'Password');
		expect(passwordInput).toBeTruthy();
		if (passwordInput) {
		expect(passwordInput.secureTextEntry).toBe(true);
		expect(passwordInput.hasIcon).toBe(true);
		expect(typeof passwordInput.onChangeText).toBe('function');
		}
	});

	// Test 7: Next button initial state
	it('renders Next button with correct initial disabled state', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(customButtonProps.length).toBeGreaterThan(0);
		});

		const buttonProps = customButtonProps[0];
		expect(buttonProps.title).toBe('Next');
		expect(buttonProps.iconPosition ?? 'right').toBe('right');
		expect(buttonProps.width).toBe(337);

		// Button should be disabled initially (white/grey)
		expect(buttonProps.color).toBe('#FFFFFF');
		expect(buttonProps.textColor).toBe('#AAAAAA');
	});

	// Test 8: Next button press navigates to next page
	it('navigates to customSignup2 with correct params when Next button is pressed', async () => {
		render(<SignUpPage />);
		
		await waitFor(() => {
		expect(customButtonProps.length).toBeGreaterThan(0);
		});

		const passwordInput = headerTextInputProps.find(p => p.headerText === 'Password');
		expect(passwordInput).toBeTruthy();

		const nextButton = customButtonProps[0];
		nextButton.onPress();

		expect(mockPush).toHaveBeenCalledWith({
			pathname: '/customSignup2',
			params: expect.objectContaining({
				id: 'user123',
				password: '',
			}),
		});
	});

});