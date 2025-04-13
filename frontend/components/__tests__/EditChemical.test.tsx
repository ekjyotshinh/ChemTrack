import EditChemical from '@/app/(tabs)/editChemical';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';
import fetchSchoolList from '@/functions/fetchSchool';


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

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
  useLocalSearchParams: jest.fn(() => ({
    id: 'mock-id-123',
  })),
  useFocusEffect: jest.fn((callback) => callback()), // Trigger effect immediately
}));

jest.mock("expo-font");

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ name: 'mockFile.pdf', uri: 'file://mockFile.pdf' }],
    })
  ),
}));


jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => {
    cb(18, 113, 357, 50)
});

jest.mock('@/functions/fetchSchool', () => jest.fn());

describe('EditChemical', () => {
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
        const { getByText } = render(<EditChemical />);
        // Shouldn't have access to the page at all
        await waitFor(() => {
            expect(getByText('Unauthorized')).toBeTruthy();
            expect(getByText('You do not have access to view this page')).toBeTruthy();
            expect(getByText('Return Home')).toBeTruthy();
        });
    });

    test('ADMIN: Renders all components', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByText, getByTestId, queryByText, queryByTestId }: any = render(<EditChemical />);  

        
        expect(getByText('Edit Chemical')).toBeTruthy();

        expect(getByText('Name')).toBeTruthy();
        expect(getByTestId('name-input')).toBeTruthy();

        expect(getByText('CAS Number')).toBeTruthy();
        expect(getByTestId('cas-0')).toBeTruthy();
        expect(getByTestId('cas-1')).toBeTruthy();
        expect(getByTestId('cas-2')).toBeTruthy();

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
        expect(getByText('Replace PDF')).toBeTruthy();
        expect(getByText('Save Chemical')).toBeTruthy();
      
    });

    test('MASTER: Renders all components', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId } = render(<EditChemical />);

        expect(getByText('Edit Chemical')).toBeTruthy();

        expect(getByText('Name')).toBeTruthy();
        expect(getByTestId('name-input')).toBeTruthy();

        expect(getByText('CAS Number')).toBeTruthy();
        expect(getByTestId('cas-0')).toBeTruthy();
        expect(getByTestId('cas-1')).toBeTruthy();
        expect(getByTestId('cas-2')).toBeTruthy();

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
        expect(getByText('Replace PDF')).toBeTruthy();
        expect(getByText('Save Chemical')).toBeTruthy();
      
    });


    // /* --TEST EDIT CHEMICAL WITHOUT ANY VALUES INPUTTED-- */

    test('ADMIN: Prevent edit chemical without entering in all fields', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const { getByText } = render(<EditChemical />);
        await act(async () => {
            fireEvent.press(getByText('Save Chemical'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields!');
            });
        });
    });

    test('MASTER: Prevent edit chemical without entering in all fields', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText } = render(<EditChemical />);
        await act(async () => {
            fireEvent.press(getByText('Save Chemical'));

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields!');
            });
        });
    });


    /* --TEST PURCHASE DATE PICKER COMPONENT RENDERING-- */

    test('ADMIN: Test purchase date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<EditChemical />);

        fireEvent.press(getByTestId("purchase-date"));
        expect(await getByTestId("purchase-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });

    test('MASTER: Test date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<EditChemical />);

        fireEvent.press(getByTestId("purchase-date"));
        expect(await getByTestId("purchase-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });


    /* --TEST EXPIRATION DATE PICKER COMPONENT RENDERING-- */

    test('ADMIN: Test expiration date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<EditChemical />);

        fireEvent.press(getByTestId("expiration-date"));
        expect(await getByTestId("expiration-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });

    test('MASTER: Test expiration date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<EditChemical />);

        fireEvent.press(getByTestId("expiration-date"));
        expect(await getByTestId("expiration-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });

});
