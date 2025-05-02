// Reusable function to fetch schools from the backend API

import { Alert } from "react-native";
import { API_URL } from '@/constants/API';

const fetchSchools = async () => {
    try {
        const response = await fetch(`${API_URL}/api/v1/users/schools`);
        const schools = await response.json();
        let schoolList = [];
        for (let i = 0; i < schools.length; i++) {
            if (schools[i] != '') {
                schoolList.push({ label: schools[i], value: schools[i] });
            }
        }
        return schoolList;

    } catch {
        console.error('Error fetching schools');
        return []
    }
};

// Fetch the list of schools from the API
const fetchSchoolList = async ({ setSchoolList }: { setSchoolList: (list: any) => void }) => {
    try {
        const list = await fetchSchools();
        setSchoolList(list);
    } catch (error) {
        console.error('Error fetching schools:', error);
        Alert.alert('Error', 'Error fetching schools');
    }
};

export default fetchSchoolList;