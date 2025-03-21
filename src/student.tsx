import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiCheckSquare, FiLogOut } from "react-icons/fi";

const StudentDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile");

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate("/app"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
                <button className="p-2 text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FiMenu size={30} />
                </button>

                <h1 className="text-xl font-bold">{activeTab}</h1>

                <div className="flex space-x-4">
                    <button className={`p-2 rounded-md ${activeTab === "Profile" ? "bg-gray-700" : "hover:bg-gray-800"}`} 
                        onClick={() => setActiveTab("Profile")}>
                        <FiUser size={24} />
                    </button>
                    <button className={`p-2 rounded-md ${activeTab === "Attendance" ? "bg-gray-700" : "hover:bg-gray-800"}`} 
                        onClick={() => setActiveTab("Attendance")}>
                        <FiCheckSquare size={24} />
                    </button>
                    <button className="p-2 rounded-md hover:bg-red-600 transition" onClick={handleLogout}>
                        <FiLogOut size={24} />
                    </button>
                </div>
            </div>

            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className={`bg-green-900 text-white h-full transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
                    <nav className="mt-4 space-y-6 p-4">
                        <button className={`flex items-center space-x-4 w-full p-3 rounded-md text-lg ${activeTab === "Profile" ? "bg-green-700" : "hover:bg-green-800"}`} 
                            onClick={() => setActiveTab("Profile")}>
                            <FiUser size={30} />
                            {isSidebarOpen && <span>Profile</span>}
                        </button>
                        <button className={`flex items-center space-x-4 w-full p-3 rounded-md text-lg ${activeTab === "Attendance" ? "bg-green-700" : "hover:bg-green-800"}`} 
                            onClick={() => setActiveTab("Attendance")}>
                            <FiCheckSquare size={30} />
                            {isSidebarOpen && <span>Attendance</span>}
                        </button>
                        <button className="flex items-center space-x-4 w-full p-3 rounded-md text-lg hover:bg-red-600"
                            onClick={handleLogout}>
                            <FiLogOut size={30} />
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {activeTab === "Profile" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Profile Section</h2>
                            <p>Student profile details...</p>
                        </div>
                    )}
                    {activeTab === "Attendance" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Attendance Section</h2>
                            <p>Attendance records...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
