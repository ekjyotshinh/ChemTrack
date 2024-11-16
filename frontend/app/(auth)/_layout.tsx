import { Stack } from 'expo-router'

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signupPage1" />
            <Stack.Screen name="signupPage2" />
        </Stack>
    )
}

export default StackLayout