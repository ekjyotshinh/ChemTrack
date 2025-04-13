import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import ViewChemicals from '@/app/(tabs)/viewChemicals';
import { useUser } from '@/contexts/UserContext';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import ModalContainer from '../viewChemicalModals/ModalContainer';
import CloseIcon from '@/assets/icons/CloseIcon';
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
        // Render the component first
        render(<ViewChemicals />);

        // Wait for the fetch call to complete and for the chemicals to appear
        await waitFor(() => expect(screen.getByText('Test Chemical')).toBeTruthy());

        // Check if the search bar and buttons are visible
        expect(screen.getByPlaceholderText('Chemical name, CAS, or school...')).toBeTruthy();
        expect(screen.getByText('Filter By')).toBeTruthy();
        expect(screen.getByText('Sort By')).toBeTruthy();
    });

    test('opens and closes modal when chemical is selected', async () => {
        const { getByText, queryByText, getByTestId } = render(<ViewChemicals />);
    
        // Wait for the chemical list to be rendered
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    
        // Click on "Test Chemical"
        fireEvent.press(getByText('Test Chemical'));
    
        // Wait for the modal to open and the label to appear
        await waitFor(() => expect(getByText('Download QR Label')).toBeTruthy());
    
        // Close the modal using the close button (Make sure CloseIcon has a testID)
        const closeButton = getByTestId('close-modal');
        fireEvent.press(closeButton);
    
        // Wait for the modal to close
        await waitFor(() => expect(queryByText('Download QR Label')).toBeNull());
    });

    test('search filters chemicals correctly', async () => {
        const { getByPlaceholderText, getByText } = render(<ViewChemicals />);

        // Type in the search bar
        fireEvent.changeText(getByPlaceholderText('Chemical name, CAS, or school...'), 'Test Chemical');

        // Wait for the filtered result to appear
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    });

    test('sort modal opens and closes', async () => {
        const { getByText, queryByText } = render(<ViewChemicals />);

        // Open the Sort Modal
        fireEvent.press(getByText('Sort By'));

        // Check for sort options
        await waitFor(() => expect(getByText(' ✓ Newest first (by date)')).toBeTruthy());
        await waitFor(() => expect(getByText('Oldest first (by date)')).toBeTruthy());
        await waitFor(() => expect(getByText('Status (High to Low)')).toBeTruthy());
        await waitFor(() => expect(getByText('Status (Low to High)')).toBeTruthy());
        await waitFor(() => expect(getByText('Lowest quantity first')).toBeTruthy());
        await waitFor(() => expect(getByText('A-Z')).toBeTruthy());
        await waitFor(() => expect(getByText('Z-A')).toBeTruthy());
        await waitFor(() => expect(getByText('By expiration')).toBeTruthy());

        // Close the Sort Modal
        fireEvent.press(getByText('Sort By'));

        // Assert that the Sort modal is no longer visible
        await waitFor(() => expect(queryByText('Newest first (by date)')).toBeNull());
        await waitFor(() => expect(queryByText('Oldest first (by date)')).toBeNull());
        await waitFor(() => expect(queryByText('Status (High to Low)')).toBeNull());
        await waitFor(() => expect(queryByText('Status (Low to High)')).toBeNull());
        await waitFor(() => expect(queryByText('Lowest quantity first')).toBeNull());
        await waitFor(() => expect(queryByText('A-Z')).toBeNull());
        await waitFor(() => expect(queryByText('Z-A')).toBeNull());
        await waitFor(() => expect(queryByText('By expiration')).toBeNull());
    });

    test('filter modal opens and closes', async () => {
        const { getByText, queryByText } = render(<ViewChemicals />);

        // Open the Filter Modal
        fireEvent.press(getByText('Filter By'));

        // Check for filter sections and options
        await waitFor(() => expect(getByText('Filter Options')).toBeTruthy());
        await waitFor(() => expect(getByText('Status')).toBeTruthy());
        await waitFor(() => expect(getByText('Purchase Date')).toBeTruthy());
        await waitFor(() => expect(getByText('Expiration Date')).toBeTruthy());

        // Assert the filter options are visible
        await waitFor(() => expect(getByText('Low')).toBeTruthy());
        await waitFor(() => expect(getByText('Fair')).toBeTruthy());
        await waitFor(() => expect(getByText('Good')).toBeTruthy());
        await waitFor(() => expect(getByText('Off-site')).toBeTruthy());
        await waitFor(() => expect(getByText('Before 2020')).toBeTruthy());
        await waitFor(() => expect(getByText('2020-2024')).toBeTruthy());
        await waitFor(() => expect(getByText('After 2024')).toBeTruthy());
        await waitFor(() => expect(getByText('Before 2025')).toBeTruthy());
        await waitFor(() => expect(getByText('2025-2030')).toBeTruthy());
        await waitFor(() => expect(getByText('After 2030')).toBeTruthy());

        // Close the Filter Modal
        fireEvent.press(getByText('✕'));

        // Assert that the filter modal is no longer visible
        await waitFor(() => expect(queryByText('Filter Options')).toBeNull());
        await waitFor(() => expect(queryByText('Status')).toBeNull());
        await waitFor(() => expect(queryByText('Purchase Date')).toBeNull());
        await waitFor(() => expect(queryByText('Expiration Date')).toBeNull());
        await waitFor(() => expect(queryByText('Low')).toBeNull());
        await waitFor(() => expect(queryByText('Fair')).toBeNull());
        await waitFor(() => expect(queryByText('Good')).toBeNull());
        await waitFor(() => expect(queryByText('Off-site')).toBeNull());
    });
});
