// editChemical.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditChemicals from '@/app/(tabs)/editChemical';
import { useUser } from '@/contexts/UserContext';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  createIconSet: () => 'Icon',
}));

jest.mock('@/components/inputFields/CasTextBoxes', () => 'CasTextBoxes');

const mockFetch = jest.fn();
global.fetch = mockFetch;

// User role definitions
interface UserInfo {
  name: string;
  email: string;
  is_admin: boolean;
  is_master: boolean;
  school: string;
  id: string;
  allow_email: boolean;
  allow_push: boolean;
}

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

const mockChemicalData = {
  id: '1',
  name: 'Test Chemical',
  CAS: '1234567',
  school: 'Encina High School',
  purchase_date: '2023-01-01',
  expiration_date: '2024-01-01',
  status: 'On-site',
  quantity: '100 mL',
  room: 'Lab 1',
  shelf: '2',
  cabinet: '3',
  uploaded: true
};

describe('EditChemicals Component', () => {
  const mockPush = jest.fn();

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_URL = 'mock-api-url';
  });

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = (user: UserInfo) => {
    (useUser as jest.Mock).mockReturnValue({ userInfo: user });
    return render(<EditChemicals />);
  };

  it('shows error page for non-admin users', async () => {
    const { findByText } = renderComponent(mockViewOnly);
    expect(await findByText('Error Page')).toBeTruthy();
  });

  it('renders form for admin users', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChemicalData),
    });

    const { findByText } = renderComponent(mockAdmin);
    expect(await findByText('Chemical Name')).toBeTruthy();
  });

  it('shows school dropdown for master users', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChemicalData),
    });

    const { findByText } = renderComponent(mockMaster);
    expect(await findByText('School')).toBeTruthy();
  });

  it('handles form submission successfully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const { getByText } = renderComponent(mockAdmin);

    await act(async () => {
      fireEvent.press(getByText('Save Chemical'));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('mock-api-url'),
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('Test Chemical')
        })
      );
    });
  });

  it('shows validation errors when required fields are missing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChemicalData),
    });

    const { getByText, update } = renderComponent(mockAdmin);
    
    await act(async () => {
      fireEvent.changeText(getByText('Chemical Name'), '');
      fireEvent.press(getByText('Save Chemical'));
    });

    expect(await getByText('Please fill in all fields!')).toBeTruthy();
  });

  it('resets form when clear button is pressed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChemicalData),
    });

    const { getByText, queryByDisplayValue } = renderComponent(mockAdmin);
    
    await act(async () => {
      fireEvent.press(getByText('Clear'));
    });

    await waitFor(() => {
      expect(queryByDisplayValue('Test Chemical')).toBeNull();
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));
    const { findByText } = renderComponent(mockAdmin);
    
    expect(await findByText('Error fetching chemical data')).toBeTruthy();
  });

  it('splits and combines CAS numbers correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockChemicalData),
    });
    
    const { findAllByDisplayValue } = renderComponent(mockAdmin);
    
    const casInputs = await findAllByDisplayValue(/\d+/);
    expect(casInputs[0].props.value).toBe('1234');
    expect(casInputs[1].props.value).toBe('56');
    expect(casInputs[2].props.value).toBe('7');
  });

  it('handles document picker selection', async () => {
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      type: 'success',
      uri: 'file://test.pdf',
      name: 'test.pdf'
    });

    const { getByText } = renderComponent(mockAdmin);
    
    await act(async () => {
      fireEvent.press(getByText('Upload Safety Data Sheet (SDS)'));
    });

    expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
  });
});