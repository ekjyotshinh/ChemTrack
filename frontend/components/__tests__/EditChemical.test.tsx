import EditChemical from '@/app/(tabs)/editChemical';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { render, fireEvent, waitFor, act, cleanup, screen } from '@testing-library/react-native';
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

global.fetch = jest.fn();

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

    /* --TEST RENDERS WITH CHEMICAL INFORMATION -- */

    test('ADMIN: Test Page Renders With information', async () => {
        /*
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        (fetchSchoolList as jest.Mock).mockImplementation(({ setSchoolList }) => {
            setSchoolList([{ label: 'Test School', value: 'Test School' }]);
        });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        // Simulate fetch to get chemical info with Pdf
        const getChemicalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                chemical: {
                    CAS: 123456578,
                    cabinet: 123,
                    expiration_date: "2031-08-11",
                    id: "1234",
                    name: "TestChem",
                    purchase_date: "2010-08-11",
                    quantity: "56 L",
                    room: "7a",
                    school: "Mock High School",
                    sdsURL: "someurl",
                    shelf: 3,
                    status: "Low",
                },
            }),
        };

        // Mock fetch reponses
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(() => getChemicalResponse);


        const { getByTestId, getByText, queryByText, queryByTestId } = render(<EditChemical />);

        await waitFor(() => {
            expect(getByText('TestChem')).toBeTruthy();
        });


        // Name
        expect(getByText('TestChem')).toBeTruthy();
        // CAS
        expect(getByText('123456')).toBeTruthy();
        expect(getByText('57')).toBeTruthy();
        expect(getByText('8')).toBeTruthy();
        // Purchase and Expiration Dates
        expect(getByText('2010-08-11')).toBeTruthy();
        expect(getByText('2031-08-11')).toBeTruthy();
        // Status
        expect(getByText('Low')).toBeTruthy();
        // Quantity
        expect(getByText('56')).toBeTruthy();
        // Unit
        expect(getByText('L')).toBeTruthy();
        // School for Master
        //expect(getByText('Test School')).toBeTruthy();
        // Room, Cabinet, Shelf
        expect(getByText('7a')).toBeTruthy();
        expect(getByText('123')).toBeTruthy();
        expect(getByText('3')).toBeTruthy();

        expect(getByText('File Uploaded')).toBeTruthy();
        */

    });

    /* --TEST SENDING NEW INFORMATION TO BACKEND -- */

    test('MASTER: Test Changing Information', async () => {
        /*
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        (fetchSchoolList as jest.Mock).mockImplementation(({ setSchoolList }) => {
            setSchoolList([{ label: 'Mock High School', value: 'Mock High School' },
            {label: 'Test School', value: 'Test School'}]);
        });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];
        // Mock Form Data
        const appendMock = jest.fn();
        global.FormData = jest.fn().mockImplementation(() => {
            return { append: appendMock };
        });

        // Simulate fetches
        const getChemicalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                chemical: {
                    CAS: 123456578,
                    cabinet: 1,
                    expiration_date: "2031-08-11",
                    id: "1234",
                    name: "TestChem",
                    purchase_date: "2010-08-11",
                    quantity: "56 L",
                    room: "23",
                    school: "1",
                    sdsURL: "someurl",
                    shelf: 3,
                    status: "Off-site",
                },
            }),
        };
        const editChemicalResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                message: 'Chemical updated successfully',
                chemical: { id: '123' },

            }),
        };

        // Simulate adding sds call
        const addPdfResponse = {
            ok: true,
            json: () => Promise.resolve({ message: "SDS uploaded successfully" }),
        };


        // Mock fetch responses
        (global.fetch as jest.Mock)
            .mockImplementation(() => getChemicalResponse)
            .mockImplementationOnce(() => editChemicalResponse)
            .mockImplementationOnce(() => addPdfResponse);


        const { getByTestId, getByText } = render(<EditChemical />);

        fireEvent.changeText(getByTestId('name-input'), 'Mock Chemical');
        fireEvent.changeText(getByTestId('cas-0'), '123456');
        fireEvent.changeText(getByTestId('cas-1'), '56');
        fireEvent.changeText(getByTestId('cas-2'), '7');

        fireEvent.press(getByTestId("purchase-date"));
        fireEvent.press(getByText("Confirm"));

        fireEvent.press(getByTestId("expiration-date"));
        fireEvent.press(getByText("Confirm"));

        fireEvent.press(getByTestId("status-dropdown"));
        const selectedStatus = getByText('Good');
        await waitFor(() => expect(selectedStatus).toBeDefined());
        fireEvent.press(selectedStatus);
        await waitFor(() => expect.objectContaining({
            label: 'Good',
            value: 'Good'
        }));

        fireEvent.changeText(getByTestId('quantity-input'), '1');

        fireEvent.press(getByTestId("unit-dropdown"));
        const selectedUnit = getByText('kg');
        await waitFor(() => expect(selectedUnit).toBeDefined());
        fireEvent.press(selectedUnit);
        await waitFor(() => expect.objectContaining({
            label: 'kg',
            value: 'kg'
        }));

        await waitFor(() => expect(fetchSchoolList).toHaveBeenCalled());

        fireEvent.press(getByTestId("school-dropdown"));
        const selectedSchool = getByText('Mock High School');
        await waitFor(() => expect(selectedSchool).toBeDefined());
        fireEvent.press(selectedSchool);
        await waitFor(() => expect.objectContaining({
            label: 'Mock High School',
            value: 'Mock High School'
        }));

        fireEvent.changeText(getByTestId('room-input'), '102A');
        fireEvent.changeText(getByTestId('cabinet-input'), '1');
        fireEvent.changeText(getByTestId('shelf-input'), '420');

        (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [
                {
                    name: 'test.pdf',
                    uri: 'file:///test.pdf',
                    mimeType: 'application/pdf',
                    size: 12345,
                },
            ],
        });

        fireEvent.press(getByText('Replace PDF'));
        await waitFor(() => {
            expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
            expect(appendMock).toHaveBeenCalledWith(
                'sds',
                expect.objectContaining({
                    uri: 'file:///test.pdf',
                    name: 'test.pdf',
                    type: 'application/pdf',
                })
            );
        });
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('File Uploaded');
        });
        expect(await getByText('test')).toBeTruthy();


        fireEvent.press(getByText('Save Chemical'));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

        const expectedData = {
            name: 'Mock Chemical',
            cas: 123456567,
            purchase_date: date,
            expiration_date: date,
            status: 'Good',
            quantity: '1 kg',
            room: '102A',
            cabinet: 1,
            shelf: 420,
            school: 'Mock High School',
        }

        // Does the data match the expected data?
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);
        expect(requestBody).toMatchObject(expectedData);

        // Check for success alert and re-routing
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Chemical and SDS information updated');
        expect(router.push).toHaveBeenCalledWith('/');
        */
    });

});
