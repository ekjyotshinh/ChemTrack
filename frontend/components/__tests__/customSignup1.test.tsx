import React from 'react';
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/react-native';
import CustomSignup1 from '@/app/(auth)/customSignup1';

// Create a mockPush function we can monitor
const mockPush = jest.fn();

jest.mock("expo-font");

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

describe('CustomSignup1', () => {
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
	});

	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	// Test 1: Components render without crashing
	it('Renders without crashing', async () => {
		const { getByTestId, getByText } = render(<CustomSignup1 />);

		await waitFor(() => {
			// Blue header
			expect(getByText('Sign Up')).toBeTruthy();
			expect(getByTestId('back-btn')).toBeTruthy();

			// Email section
			expect(getByText('Email')).toBeTruthy();
			expect(getByTestId('emailInput')).toBeTruthy();

			// Password section
			expect(getByText('Password')).toBeTruthy();
			expect(getByTestId('passwordInput')).toBeTruthy();

			// School section
			expect(getByText('School')).toBeTruthy();
			expect(getByTestId('schoolInput')).toBeTruthy();

			// User type section
			expect(getByText('User Type')).toBeTruthy();
			expect(getByTestId('userTypeInput')).toBeTruthy();

			// Next button
			expect(getByText('Next')).toBeTruthy();
		});
	});

	// Test 2: Back button navigation
	it('Navigates to login when back button is pressed', async () => {
		const { getByTestId } = render(<CustomSignup1 />);

		await waitFor(() => {
			fireEvent.press(getByTestId('back-btn'));
		});

		expect(mockPush).toHaveBeenCalledWith('/login');
	});

	// Test 3: Email input receives correct props
	it('Passes correct props to email input', async () => {
		const { getByTestId } = render(<CustomSignup1 />);
		await waitFor(() => {
			const emailInput = getByTestId('emailInput');
			expect(emailInput).toBeTruthy();

			// Shouldn't have a pencil icon
			expect(within(emailInput).queryByTestId('pencil-icon')).toBeNull;

			// Should have value from initial fetch
			expect(emailInput).toHaveDisplayValue('testuser@example.com');

			// Text box should not be editable
			fireEvent.changeText(emailInput, 'nochange@gmail.com');
			expect(emailInput).toHaveDisplayValue('testuser@example.com');
		});
	});

	// Test 4: School input receives correct props
	it('Passes correct props to school input', async () => {
		const { getByTestId } = render(<CustomSignup1 />);
		await waitFor(() => {
			const schoolInput = getByTestId('schoolInput');
			expect(schoolInput).toBeTruthy();

			// Shouldn't have a pencil icon
			expect(within(schoolInput).queryByTestId('pencil-icon')).toBeNull;

			// Should have value from initial fetch
			expect(schoolInput).toHaveDisplayValue('Mock School');

			// Text box should not be editable
			fireEvent.changeText(schoolInput, 'New School');
			expect(schoolInput).toHaveDisplayValue('Mock School');
		});
	});

	// Test 5: User Type input receives correct props
	it('Passes correct props to User Type input', async () => {
		const { getByTestId } = render(<CustomSignup1 />);
		await waitFor(() => {
			const userTypeInput = getByTestId('userTypeInput');
			expect(userTypeInput).toBeTruthy();

			// Shouldn't have a pencil icon
			expect(within(userTypeInput).queryByTestId('pencil-icon')).toBeNull;

			// Should have value from initial fetch
			expect(userTypeInput).toHaveDisplayValue('Master');

			// Text box should not be editable
			fireEvent.changeText(userTypeInput, 'No Change');
			expect(userTypeInput).toHaveDisplayValue('Master');
		});
	});

	// Test 6: Password input receives correct props
	it('Passes correct props to password input', async () => {
		const { getByTestId } = render(<CustomSignup1 />);
		await waitFor(() => {
			const passwordInput = getByTestId('passwordInput');
			expect(passwordInput).toBeTruthy();

			// Make sure it has pencil icon
			expect(within(passwordInput).queryByTestId('pencil-icon')).toBeNull;

			// Empty initially
			expect(passwordInput).toHaveDisplayValue('');

			// Text box should be editable
			fireEvent.changeText(passwordInput, 'password123');
			expect(passwordInput).toHaveDisplayValue('password123');
		});
	});

	// Test 7: Next button initial state
	it('Renders Next button with correct initial disabled state', async () => {
		const { getByText } = render(<CustomSignup1 />);

		await waitFor(() => {
			const nextButton = getByText('Next');
			fireEvent.press(nextButton);

			// Nothing changes since password is empty initially
			expect(mockPush).not.toHaveBeenCalled();
		});
	});

	// Test 8: Next button press navigates to next page
	it('Navigates to customSignup2 with correct params when Next button is pressed', async () => {
		const { getByTestId, getByText } = render(<CustomSignup1 />);
		await waitFor(() => {
			const passwordInput = getByTestId('passwordInput');
			fireEvent.changeText(passwordInput, 'password123');
			expect(passwordInput).toHaveDisplayValue('password123');

			const nextButton = getByText('Next');
			fireEvent.press(nextButton);

			expect(mockPush).toHaveBeenCalledWith({
				pathname: '/customSignup2',
				params: expect.objectContaining({
					id: 'user123',
					password: 'password123',
				}),
			});
		});
	});

});