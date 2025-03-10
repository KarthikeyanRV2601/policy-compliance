import UserService from "@/service/userService";
import { Employee } from "@prisma/client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserContextType {
    user: Employee | null;
    setUser: (user: Employee | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Employee | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserService.getUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
