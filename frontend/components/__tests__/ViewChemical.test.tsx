import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import ViewChemicals from '@/app/(tabs)/viewChemicals';
import { useUser } from '@/contexts/UserContext';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import ModalContainer from '../viewChemicalModals/ModalContainer';
import CloseIcon from '@/assets/icons/CloseIcon'
// if you are reading these tests then this one was a real pain & try not to understand anything cause I dont either.
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
            userInfo: { is_master: true, school: 'Test School' } 
        });
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (useIsFocused as jest.Mock).mockReturnValue(true); // Ensuring tjhe screen is in focus
    });

    test('renders correctly', () => {
        const { getByText,getByPlaceholderText } = render(<ViewChemicals />);
        expect(getByPlaceholderText('Chemical name, CAS, or school...')).toBeTruthy();
        expect(getByText('Filter By')).toBeTruthy();
        expect(getByText('Sort By')).toBeTruthy();
    });

    test('opens and closes modal when chemical is selected', async () => {
        const { getByText, queryByText } = render(<ViewChemicals />);
        
        // chemicals list to be rendered
        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    
        // Test Chemical clicked
        await act(async () => {
            fireEvent.press(getByText('Test Chemical'));
        });
    
        // Modal opens ans assesrt it opens
        await waitFor(() => expect(ModalContainer).toBeTruthy());
    
        // Close the modal
        await act(async () => {
            fireEvent.press(CloseIcon);//CloseIcon
        });
    
        // Assert that the modal is closed
        await waitFor(() => expect(queryByText('Chemical Details')).toBeNull());
    });


    test('search filters chemicals correctly', async () => {
        const { getByPlaceholderText, getByText } = render(<ViewChemicals />);
        
        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Chemical name, CAS, or school...'), 'Test Chemical');
        });

        await act(async () => {
            fireEvent.press(getByPlaceholderText('Chemical name, CAS, or school...'));
        });

        await waitFor(() => expect(getByText('Test Chemical')).toBeTruthy());
    });

    test('sort modal opens and closes', async () => {
        const { getByText,queryByText } = render(<ViewChemicals />);
    
        // Open the Sort Modal 
        await act(async () => {
            fireEvent.press(getByText('Sort By'));
        });
    
        // Sort modal to be visible
        await waitFor(() => expect(getByText(' ✓ Newest first (by date)')).toBeTruthy());
        await waitFor(() => expect(getByText('Oldest first (by date)')).toBeTruthy());
        await waitFor(() => expect(getByText('Status (High to Low)')).toBeTruthy());
        await waitFor(() => expect(getByText('Status (Low to High)')).toBeTruthy());
        await waitFor(() => expect(getByText('Lowest quantity first')).toBeTruthy());
        await waitFor(() => expect(getByText('A-Z')).toBeTruthy());
        await waitFor(() => expect(getByText('Z-A')).toBeTruthy());
        await waitFor(() => expect(getByText('By expiration')).toBeTruthy());
    
        // Close the Sort Modal 
        await act(async () => {
            fireEvent.press(getByText('Sort By'));
        });
    
        // Assert that the Sort modal is no longer visible
        expect(queryByText('Newest first (by date)')).toBeNull();
        expect(queryByText('Oldest first (by date)')).toBeNull();
        expect(queryByText('Status (High to Low)')).toBeNull();
        expect(queryByText('Status (Low to High)')).toBeNull();
        expect(queryByText('Lowest quantity first')).toBeNull();
        expect(queryByText('A-Z')).toBeNull();
        expect(queryByText('Z-A')).toBeNull();
        expect(queryByText('By expiration')).toBeNull();
    });
    
    test('filter modal opens and closes', async () => {
        const { getByText, queryByText } = render(<ViewChemicals />);

        // Open the Filter Modal
        await act(async () => {
            fireEvent.press(getByText('Filter By'));
        });

        // check for filter sections and options
        await waitFor(() => expect(getByText('Filter Options')).toBeTruthy());
        await waitFor(() => expect(getByText('Status')).toBeTruthy());
        await waitFor(() => expect(getByText('Purchase Date')).toBeTruthy());
        await waitFor(() => expect(getByText('Expiration Date')).toBeTruthy());

        // assesrt filter section to be visible
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
        await act(async () => {
            fireEvent.press(getByText('✕'));
        });

        // Assert that the Filter modal is no longer visible
        expect(queryByText('Filter Options')).toBeNull();
        expect(queryByText('Status')).toBeNull();
        expect(queryByText('Purchase Date')).toBeNull();
        expect(queryByText('Expiration Date')).toBeNull();

        // Assert that the options under each filter section are no longer visible
        expect(queryByText('Low')).toBeNull();
        expect(queryByText('Fair')).toBeNull();
        expect(queryByText('Good')).toBeNull();
        expect(queryByText('Off-site')).toBeNull();
        expect(queryByText('Before 2020')).toBeNull();
        expect(queryByText('2020-2024')).toBeNull();
        expect(queryByText('After 2024')).toBeNull();
        expect(queryByText('Before 2025')).toBeNull();
        expect(queryByText('2025-2030')).toBeNull();
        expect(queryByText('After 2030')).toBeNull();
    });


    test('fetches chemicals from API', async () => {
        render(<ViewChemicals />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Verify that fetch is called once
    });
});
