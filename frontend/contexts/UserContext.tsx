import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for user information
interface UserInfo {
  name: string;
  email: string;
  is_admin: boolean;
  is_master: boolean;
  school: string;
  id: string;
}

// Create a Context with a default empty user object
const UserContext = createContext<{
  userInfo: UserInfo;
  updateUserInfo: (newUserInfo: UserInfo) => void;
}>({
  userInfo: {
    name: '',
    email: '',
    is_admin: false,
    is_master: false,
    school: '',
    id: '',
  },
  updateUserInfo: () => {},
});

// Create a custom hook for using the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Create a Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email:'',
    is_admin: false,
    is_master: false,
    school: '',
    id: '',
  });

  const updateUserInfo = (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
