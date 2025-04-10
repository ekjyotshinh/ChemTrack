import AddChemical from '@/app/(tabs)/addChemical';
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

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock("expo-font");

jest.mock("expo-document-picker", () => ({
    getDocumentAsync: jest.fn(),
}));

jest.spyOn(View.prototype, 'measureInWindow').mockImplementation((cb) => {
    cb(18, 113, 357, 50)
});

jest.mock('@/functions/fetchSchool', () => jest.fn());

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
        expect(getByText('Upload')).toBeTruthy();
        expect(getByText('Save Chemical')).toBeTruthy();
        expect(getByText('Clear')).toBeTruthy();
    });

    test('MASTER: Renders all components', () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const { getByText, getByTestId } = render(<AddChemical />);

        expect(getByText('Add Chemical')).toBeTruthy();

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


    /* --TEST PURCHASE DATE PICKER COMPONENT RENDERING-- */

    test('ADMIN: Test purchase date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];
  
        const { getByTestId, getByText } = render(<AddChemical />);

        fireEvent.press(getByTestId("purchase-date"));
        expect(await getByTestId("purchase-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });

    test('MASTER: Test date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<AddChemical />);

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

        const { getByTestId, getByText } = render(<AddChemical />);

        fireEvent.press(getByTestId("expiration-date"));
        expect(await getByTestId("expiration-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });

    test('MASTER: Test expiration date picker modal', async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText } = render(<AddChemical />);

        fireEvent.press(getByTestId("expiration-date"));
        expect(await getByTestId("expiration-date-picker")).toBeTruthy();
        fireEvent.press(getByText("Confirm"));
        expect(await getByText(date)).toBeTruthy();
    });


    /* --TEST CLEAR BUTTON-- */

    test("ADMIN: Test clear button", async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText, findByText, queryByText } = render(<AddChemical />);

        fireEvent.changeText(getByTestId('name-input'), 'Mock Chemical');
        fireEvent.changeText(getByTestId('cas-0'), '1234');
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

        fireEvent.press(getByText('Upload'));
        expect(await findByText('File Uploaded')).toBeTruthy();

        fireEvent.press(getByText("Clear"));

        // All values should be cleared
        expect(getByTestId('name-input')).toHaveDisplayValue('');
        expect(getByTestId('cas-0')).toHaveDisplayValue('');
        expect(getByTestId('cas-1')).toHaveDisplayValue('');
        expect(getByTestId('cas-2')).toHaveDisplayValue('');
        expect(queryByText(date)).toBeNull();
        expect(queryByText("Good")).toBeNull();
        expect(getByTestId('quantity-input')).toHaveDisplayValue('');
        expect(queryByText("kg")).toBeNull();
        expect(getByTestId('room-input')).toHaveDisplayValue('');
        expect(getByTestId('cabinet-input')).toHaveDisplayValue('');
        expect(getByTestId('shelf-input')).toHaveDisplayValue('');
        expect(getByText('Upload')).toBeTruthy();
    });

    test("MASTER: Test clear button", async () => {

        (fetchSchoolList as jest.Mock).mockImplementation(({ setSchoolList }) => {
            setSchoolList([{ label: 'Mock High School', value: 'Mock High School' }]);
        });

        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText, findByText, queryByText } = render(<AddChemical />);

        fireEvent.changeText(getByTestId('name-input'), 'Mock Chemical');
        fireEvent.changeText(getByTestId('cas-0'), '1234');
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

        fireEvent.press(getByText('Upload'));
        expect(await findByText('File Uploaded')).toBeTruthy();

        fireEvent.press(getByText("Clear"));

        // All values should be cleared
        expect(getByTestId('name-input')).toHaveDisplayValue('');
        expect(getByTestId('cas-0')).toHaveDisplayValue('');
        expect(getByTestId('cas-1')).toHaveDisplayValue('');
        expect(getByTestId('cas-2')).toHaveDisplayValue('');
        expect(queryByText(date)).toBeNull();
        expect(queryByText("Good")).toBeNull();
        expect(getByTestId('quantity-input')).toHaveDisplayValue('');
        expect(queryByText("kg")).toBeNull();
        expect(queryByText("Mock High School")).toBeNull();
        expect(getByTestId('room-input')).toHaveDisplayValue('');
        expect(getByTestId('cabinet-input')).toHaveDisplayValue('');
        expect(getByTestId('shelf-input')).toHaveDisplayValue('');
        expect(getByText('Upload')).toBeTruthy();
    });


    /* --TEST SAVE CHEMICAL BUTTON-- */

    test("ADMIN: Test save chemical button", async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockAdmin });

        // Simulate adding chemical call
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Chemical added successfully" }),
            })
        ) as jest.Mock;

        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText, findByText, queryByText } = render(<AddChemical />);

        fireEvent.changeText(getByTestId('name-input'), 'Mock Chemical');
        fireEvent.changeText(getByTestId('cas-0'), '1234');
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

        fireEvent.press(getByText('Upload'));
        expect(await findByText('File Uploaded')).toBeTruthy();

        fireEvent.press(getByText('Save Chemical'));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const expectedData = {
            name: 'Mock Chemical',
            cas: 1234567,
            purchase_date: date,
            expiration_date: date,
            status: 'Good',
            quantity: '1 kg',
            room: '102A',
            cabinet: 1,
            shelf: 420,
            school: 'Test School',
        }
        
        // Does the data match the expected data?
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);
        expect(requestBody).toMatchObject(expectedData);

        // Clear all values
        // there is a redirect at save chemical
        //waitFor(() => {
        //    expect(getByTestId('name-input')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-0')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-1')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-2')).toHaveDisplayValue('');
        //    expect(queryByText(date)).toBeNull();
        //    expect(queryByText("Good")).toBeNull();
        //    expect(getByTestId('quantity-input')).toHaveDisplayValue('');
        //    expect(queryByText("kg")).toBeNull();
        //    expect(getByTestId('room-input')).toHaveDisplayValue('');
        //    expect(getByTestId('cabinet-input')).toHaveDisplayValue('');
        //    expect(getByTestId('shelf-input')).toHaveDisplayValue('');
        //    expect(getByText('Upload')).toBeTruthy();
        //});

        // Check for success alert and re-routing
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Chemical information added');
        expect(router.push).toHaveBeenCalledWith('/');
    });

    test("MASTER: Test save chemical button", async () => {
        (useUser as jest.Mock).mockReturnValue({ userInfo: mockMaster });
        (fetchSchoolList as jest.Mock).mockImplementation(({ setSchoolList }) => {
            setSchoolList([{ label: 'Mock High School', value: 'Mock High School' }]);
        });

        // Simulate adding chemical call
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Chemical added successfully" }),
            })
        ) as jest.Mock;

        const newDate = new Date();
        const date = newDate?.toISOString().split('T')[0];

        const { getByTestId, getByText, findByText, queryByText } = render(<AddChemical />);

        fireEvent.changeText(getByTestId('name-input'), 'Mock Chemical');
        fireEvent.changeText(getByTestId('cas-0'), '1234');
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

        fireEvent.press(getByText('Upload'));
        expect(await findByText('File Uploaded')).toBeTruthy();

        fireEvent.press(getByText('Save Chemical'));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const expectedData = {
            name: 'Mock Chemical',
            cas: 1234567,
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

        // there is a redirect at the save
        // Clear all values
        //waitFor(() => {
        //    expect(getByTestId('name-input')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-0')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-1')).toHaveDisplayValue('');
        //    expect(getByTestId('cas-2')).toHaveDisplayValue('');
        //    expect(queryByText(date)).toBeNull();
        //    expect(queryByText("Good")).toBeNull();
        //    expect(getByTestId('quantity-input')).toHaveDisplayValue('');
        //    expect(queryByText("kg")).toBeNull();
        //    expect(queryByText("Mock High School")).toBeNull();
        //    expect(getByTestId('room-input')).toHaveDisplayValue('');
        //    expect(getByTestId('cabinet-input')).toHaveDisplayValue('');
        //    expect(getByTestId('shelf-input')).toHaveDisplayValue('');
        //    expect(getByText('Upload')).toBeTruthy();
        //});

        // Check for success alert and re-routing
        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Chemical information added');
        expect(router.push).toHaveBeenCalledWith('/');
    });

});