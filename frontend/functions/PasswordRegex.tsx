import { useEffect } from "react";

interface PasswordRegexProps {
    password: string;
    setIsValidPassword: (bool: boolean) => void;
}

// Regex that checks if the password is valid (at least one uppercase, one lowercase, one number, and one special character)
const passwordRegex = ({ password, setIsValidPassword }: PasswordRegexProps) => {
    useEffect(() => {
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            .test(password) ? setIsValidPassword(true) : setIsValidPassword(false);
    }, [password]);
}

export default passwordRegex