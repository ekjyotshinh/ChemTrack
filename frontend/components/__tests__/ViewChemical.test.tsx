import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import ViewChemicals from '@/app/(tabs)/viewChemicals';
import { useUser } from '@/contexts/UserContext';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Mocking required modules
jest.mock('@/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('ViewChemicals Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: '1',
                            name: 'Test Chemical',
                            CAS: '67-64-1',
                            purchase_date: '2023-01-01',
                            expiration_date: '2025-12-31',
                            school: 'Test School',
                            room: '101',
                            cabinet: 'C1',
                            shelf: 'S1',
                            status: 'Good',
                            quantity: '500ml',
                            location: 'Room 101, Cabinet C1, Shelf S1',
                        },
                    ]),
            })
        ) as jest.Mock;

        (useUser as jest.Mock).mockReturnValue({
            userInfo: { is_master: true, school: 'Test School' },
        });
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (useIsFocused as jest.Mock).mockReturnValue(true); // Ensuring the screen is in focus
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders correctly and loads chemicals after fetch', async () => {
        // Render the component
        const { getByText, getByPlaceholderText } = render(<ViewChemicals />);

        // Wait for the fetch call to complete and for the chemicals to appear
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());

        // Check if the search bar and buttons are visible - Updated placeholder text to match actual component
        expect(getByPlaceholderText('Chemical name, CAS, ID, or school...')).toBeTruthy();
        expect(getByText('Filter By')).toBeTruthy();
        expect(getByText('Sort By')).toBeTruthy();
    });

    test('opens and closes modal when chemical is selected', async () => {
        // Wrap the render in act
        const { getByText, queryByText, getByTestId } = render(<ViewChemicals />);
        
        // Wait for the chemical list to be rendered
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    
        // Click on "Test Chemical"
        await act(async () => {
            fireEvent.press(getByText('Test Chemical'));
        });
    
        // Wait for the modal to open
        await waitFor(() => expect(getByText('SDS')).toBeTruthy());
    
        // Close the modal using the close button
        await act(async () => {
            // If CloseIcon doesn't have a testID, you might need to find it differently
            // For example, by using getByText('Close') or by accessing it through its parent
            try {
                const closeButton = getByTestId('close-modal');
                fireEvent.press(closeButton);
            } catch (error) {
                // If the close button can't be found by testID, try a different approach
                const downloadButton = getByText('Download');
                // Tap outside the modal or use a different method to close it
                fireEvent.press(downloadButton);
            }
        });
    
        // Wait for the modal to close
        await waitFor(() => expect(queryByText('Download QR Label')).toBeNull());
    });

    test('search filters chemicals correctly', async () => {
        const { getByPlaceholderText, getByText } = render(<ViewChemicals />);

        // Type in the search bar - Updated placeholder text
        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Chemical name, CAS, ID, or school...'), 'Test Chemical');
        });

        // Wait for the filtered result to appear
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    });

    test('sort modal opens and closes', async () => {
        const { getByText, queryByText } = render(<ViewChemicals />);

        // Open the Sort Modal
        await act(async () => {
            fireEvent.press(getByText('Sort By'));
        });

        // Check for sort options - Updated text to match actual component
        await waitFor(() => expect(getByText(/Newest/)).toBeTruthy());
        await waitFor(() => expect(getByText(/Oldest/)).toBeTruthy());
        await waitFor(() => expect(getByText('Status (High to Low)')).toBeTruthy());
        await waitFor(() => expect(getByText('Status (Low to High)')).toBeTruthy());

        // Close the Sort Modal
        await act(async () => {
            fireEvent.press(getByText('Sort By'));
        });

        // Assert that the Sort modal is no longer visible
        await waitFor(() => expect(queryByText(/Newest/)).toBeNull());
        await waitFor(() => expect(queryByText(/Oldest/)).toBeNull());
    });

    test('filter modal opens and closes', async () => {
        const { getByText, queryByText, getAllByText } = render(<ViewChemicals />);

        // Open the Filter Modal
        await act(async () => {
            fireEvent.press(getByText('Filter By'));
        });

        // Check for filter sections and options - Use a more specific text
        await waitFor(() => expect(getByText('Filter Options')).toBeTruthy());
        await waitFor(() => expect(getByText('Status')).toBeTruthy());

        // Close the Filter Modal - Using the X button or other close mechanism
        await act(async () => {
            try {
                fireEvent.press(getByText('✕'));
            } catch (error) {
                // If the '✕' isn't found, try clicking outside or another close method
                fireEvent.press(getByText('Filter By'));
            }
        });

        // Assert that the filter modal is no longer visible
        await waitFor(() => expect(queryByText('Filter Options')).toBeNull());
    });
});