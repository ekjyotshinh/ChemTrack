import { useEffect } from "react";

interface EmailRegexProps {
    email: string;
    setIsValidEmail: (bool: boolean) => void;
}

// Regex that checks if the email is valid
const emailRegex = ({ email, setIsValidEmail }: EmailRegexProps) => {
    useEffect(() => {
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            .test(email) ? setIsValidEmail(true) : setIsValidEmail(false);
    }, [email]);
}

export default emailRegex