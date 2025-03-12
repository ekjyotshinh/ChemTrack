import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditChemical from '../../app/(tabs)/editChemical';
import { useUser } from '../../contexts/UserContext';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, Text } from 'react-native';

// Mock implementations
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  Font: {
    loadAsync: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  createIconSet: () => 'CustomIcon',
}));

jest.mock('../../components/BlueHeader', () => 'BlueHeader');
jest.mock('../../components/CustomButton', () => {
  return ({ title, onPress }: { title: string; onPress: () => void }) => (
    <Text testID="custom-button" onPress={onPress as any}>
      {title}
    </Text>
  );
});
jest.mock('../../components/inputFields/HeaderTextInput', () => 'HeaderTextInput');
jest.mock('../../components/inputFields/CasTextBoxes', () => 'CasTextBoxes');
jest.mock('../../components/inputFields/DateInput', () => 'DateInput');
jest.mock('../../components/inputFields/DropdownInput', () => 'DropdownInput');

jest.mock('../../contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

interface UserInfo {
  is_admin: boolean;
  is_master: boolean;
  school?: string;
}

const mockChemicalData = {
  id: '1',
  name: 'Test Chemical',
  CAS: '1234567',
  school: 'Test School',
  purchase_date: '2023-01-01',
  expiration_date: '2024-01-01',
  status: 'Good',
  quantity: '100 mL',
  room: 'Lab 1',
  shelf: '2',
  cabinet: '3',
  uploaded: true
};

describe('EditChemical Component', () => {
  const mockPush = jest.fn();
  const mockAlert = jest.spyOn(Alert, 'alert');
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
    process.env.EXPO_PUBLIC_API_URL = 'http://mock-api-url';
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = (user: UserInfo) => {
    (useUser as jest.Mock).mockReturnValue({ userInfo: user });
    return render(<EditChemical />);
  };

  it('shows access error for non-admin users', async () => {
    const { findByText } = renderComponent({ is_admin: false, is_master: false });
    expect(await findByText('You do not have access to view this page')).toBeTruthy();
  });

  it('loads and displays chemical data for admin', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChemicalData,
    });

    const { findByDisplayValue } = renderComponent({ is_admin: true, is_master: false });

    await waitFor(async () => {
      expect(await findByDisplayValue('Test Chemical')).toBeTruthy();
      expect(await findByDisplayValue('Lab 1')).toBeTruthy();
    });
  });

  it('handles form submission successfully', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockChemicalData })
      .mockResolvedValueOnce({ ok: true });

    const { findByText } = renderComponent({ is_admin: true, is_master: false });

    await act(async () => {
      fireEvent.press(await findByText('Save Chemical'));
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://mock-api-url/api/v1/chemicals/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(mockAlert).toHaveBeenCalledWith('Success', 'Chemical information updated');
    });
  });

  it('shows validation errors for missing fields', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockChemicalData, name: '' }),
    });

    const { findByText } = renderComponent({ is_admin: true, is_master: false });

    await act(async () => {
      fireEvent.press(await findByText('Save Chemical'));
    });

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Please fill in all fields!');
  });

  it('handles PDF upload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChemicalData,
    });

    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ name: 'test.pdf' }],
    });

    const { findByText } = renderComponent({ is_admin: true, is_master: false });

    await act(async () => {
      fireEvent.press(await findByText('Replace PDF'));
    });

    expect(mockAlert).toHaveBeenCalledWith('PDF Uploaded!');
  });

  it('clears form data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChemicalData,
    });

    const { findByText, queryByDisplayValue } = renderComponent({
      is_admin: true,
      is_master: false,
    });

    await act(async () => {
      fireEvent.press(await findByText('Clear'));
    });

    await waitFor(() => {
      expect(queryByDisplayValue('Test Chemical')).toBeNull();
      expect(queryByDisplayValue('Lab 1')).toBeNull();
    });
  });

  it('handles API fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    renderComponent({ is_admin: true, is_master: false });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Error fetching chemical data');
    });
  });

  it('shows school dropdown for master users', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockChemicalData,
    });

    const { findByText } = renderComponent({ is_admin: false, is_master: true });
    expect(await findByText('School')).toBeTruthy();
  });
});