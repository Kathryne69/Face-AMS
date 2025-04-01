import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import AttendanceList from "./components/AttendanceList";
import emailToNameMap from "./utils/emailToNameMap";

const StudentDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile");
    const [userName, setUserName] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // Track access

    useEffect(() => {
        const user = auth.currentUser;

        if (user && user.email) {
            const mappedName = emailToNameMap[user.email];

            if (mappedName) {
                setUserName(mappedName);
                setIsAuthorized(true); // Allow access
            } else {
                setIsAuthorized(false); // Mark unauthorized
                signOut(auth).then(() => navigate("/app")); // Logout & redirect
            }
        } else {
            setIsAuthorized(false); // No user, deny access
            navigate("/app"); // Redirect unauthenticated users
        }
    }, [auth, navigate]);

    if (isAuthorized === null) {
        return <p>Checking authorization...</p>; // Prevent UI flashing
    }

    if (!isAuthorized) {
        return null; // Prevent unauthorized UI rendering
    }

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate("/app"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="h-screen flex flex-col">
            <TopBar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            <div className="flex flex-grow">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleLogout={handleLogout}
                />
                <div className="flex-1 p-6">
                    {activeTab === "Profile" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Profile Section</h2>
                            <p>Welcome, {userName}!</p>
                        </div>
                    )}
                    {activeTab === "Attendance" && (
                        <AttendanceList db={db} userName={userName} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
