// Reusable function to fetch schools from the backend API

const fetchSchools = async () => {
    const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}`;
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
}

export default fetchSchools;