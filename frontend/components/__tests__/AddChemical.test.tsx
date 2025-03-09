import React from 'react';
import AddChemical from '@/app/(tabs)/addChemical';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';

interface UserInfo {
    name: string;
    email: string;
    is_admin: boolean;
    is_master: boolean;
    school: string;
    id: string;
    allow_email: boolean;
    allow_push: boolean;
};

const mockViewOnly: UserInfo = {
    name: 'Test View',
    email: 'view@example.com',
    is_admin: false,
    is_master: false,
    school: 'Test School',
    id: '123',
    allow_email: true,
    allow_push: false,
};

const mockAdmin: UserInfo = {
    name: 'Test Admin',
    email: 'admin@example.com',
    is_admin: true,
    is_master: false,
    school: 'Test School',
    id: '123',
    allow_email: true,
    allow_push: false,
};

const mockMaster: UserInfo = {
    name: 'Test Master',
    email: 'master@example.com',
    is_admin: false,
    is_master: true,
    school: 'Test School',
    id: '123',
    allow_email: true,
    allow_push: false,
};

jest.mock('@/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock("expo-font");

describe('AddChemical', () => {
    let router: { replace: jest.Mock; push: jest.Mock };

    beforeEach(() => {
        router = { replace: jest.fn(), push: jest.fn() };
        (useRouter as jest.Mock).mockReturnValue(router);
        jest.spyOn(Alert, 'alert');
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });


    /* --TEST UI COMPONENTS RENDERING-- */

    test('VIEW ONLY: Renders all components', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockViewOnly });
        const { getByText } = render(<AddChemical />);
        // Shouldn't have access to the page at all
        await waitFor(() => {
            expect(getByText('Unauthorized')).toBeTruthy();
            expect(getByText('You do not have access to view this page')).toBeTruthy();
            expect(getByText('Return Home')).toBeTruthy();
        });
    });

    test('ADMIN: Renders all components', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByText, getByTestId, queryByTestId, queryByText } = render(<AddChemical />);

        expect(getByText('Add Chemical')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('CAS Number')).toBeTruthy();

        expect(getByText('Purchase Date')).toBeTruthy();
        expect(getByTestId('purchase-date')).toBeTruthy();
        expect(getByText('Expiration Date')).toBeTruthy();
        expect(getByTestId('expiration-date')).toBeTruthy();

        expect(getByText('Status')).toBeTruthy();
        expect(getByTestId('status-dropdown')).toBeTruthy();

        expect(getByText('Quantity')).toBeTruthy();
        expect(getByTestId('quantity-input')).toBeTruthy();

        // Ensure admins aren't able to change school
        expect(queryByText('School')).toBeNull;
        expect(queryByTestId('school-dropdown')).toBeNull;

        expect(getByText('Unit')).toBeTruthy();
        expect(getByTestId('unit-dropdown')).toBeTruthy();

        expect(getByText('Room')).toBeTruthy();
        expect(getByTestId('room-input')).toBeTruthy();

        expect(getByText('Cabinet')).toBeTruthy();
        expect(getByTestId('cabinet-input')).toBeTruthy();

        expect(getByText('Shelf')).toBeTruthy();
        expect(getByTestId('shelf-input')).toBeTruthy();

        expect(getByText('SDS')).toBeTruthy();
        expect(getByText('Upload')).toBeTruthy();
        expect(getByText('Save Chemical')).toBeTruthy();
        expect(getByText('Clear')).toBeTruthy();
    });

    test('MASTER: Renders all components', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId } = render(<AddChemical />);

        expect(getByText('Add Chemical')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByText('CAS Number')).toBeTruthy();

        expect(getByText('Purchase Date')).toBeTruthy();
        expect(getByTestId('purchase-date')).toBeTruthy();
        expect(getByText('Expiration Date')).toBeTruthy();
        expect(getByTestId('expiration-date')).toBeTruthy();

        expect(getByText('Status')).toBeTruthy();
        expect(getByTestId('status-dropdown')).toBeTruthy();

        expect(getByText('Quantity')).toBeTruthy();
        expect(getByTestId('quantity-input')).toBeTruthy();

        // Should render school
        expect(getByText('School')).toBeTruthy();
        expect(getByTestId('school-dropdown')).toBeTruthy();

        expect(getByText('Unit')).toBeTruthy();
        expect(getByTestId('unit-dropdown')).toBeTruthy();

        expect(getByText('Room')).toBeTruthy();
        expect(getByTestId('room-input')).toBeTruthy();

        expect(getByText('Cabinet')).toBeTruthy();
        expect(getByTestId('cabinet-input')).toBeTruthy();

        expect(getByText('Shelf')).toBeTruthy();
        expect(getByTestId('shelf-input')).toBeTruthy();

        expect(getByText('SDS')).toBeTruthy();
        expect(getByText('Upload')).toBeTruthy();
        expect(getByText('Save Chemical')).toBeTruthy();
        expect(getByText('Clear')).toBeTruthy();
    });


    // /* --TEST ADD CHEMICAL WITHOUT ANY VALUES INPUTTED-- */

    test('ADMIN: Prevent add chemical without entering in all fields', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByText } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByText('Save Chemical'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields!');
            });
        });
    });

    test('MASTER: Prevent add chemical without entering in all fields', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByText('Save Chemical'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields!');
            });
        });
    });


    /* --TEST DATE PICKER COMPONENT RENDERING-- */

    test('ADMIN: Test purchase date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByTestId } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByTestId('purchase-date'));

            await waitFor(() => {
                expect(getByTestId('purchase-date-picker')).toBeTruthy();
            });
        });
    });

    test('MASTER: Test date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByTestId } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByTestId('purchase-date'));

            await waitFor(() => {
                expect(getByTestId('purchase-date-picker')).toBeTruthy();
            });
        });
    });

    test('ADMIN: Test expiration date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByTestId } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByTestId('expiration-date'));

            await waitFor(() => {
                expect(getByTestId('expiration-date-picker')).toBeTruthy();
            });
        });
    });

    test('MASTER: Test expiration date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByTestId } = render(<AddChemical />);
        await act(async () => {
            fireEvent.press(getByTestId('expiration-date'));

            await waitFor(() => {
                expect(getByTestId('expiration-date-picker')).toBeTruthy();
            });
        });
    });

});