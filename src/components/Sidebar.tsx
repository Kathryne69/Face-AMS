import { FiUser, FiCheckSquare, FiLogOut } from "react-icons/fi";

interface SidebarProps {
    isSidebarOpen: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, activeTab, setActiveTab, handleLogout }) => {
    return (
        <div className={`bg-green-900 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"} min-h-screen`}>
            <nav className="mt-4 space-y-6 p-4">
                <button
                    className={`flex items-center space-x-4 w-full p-3 rounded-md text-lg ${
                        activeTab === "Home" ? "bg-green-700" : "hover:bg-green-800"
                    }`}
                    onClick={() => setActiveTab("Home")}
                >
                    <FiUser size={30} />
                    {isSidebarOpen && <span>Home</span>}
                </button>
                <button
                    className={`flex items-center space-x-4 w-full p-3 rounded-md text-lg ${
                        activeTab === "Attendance" ? "bg-green-700" : "hover:bg-green-800"
                    }`}
                    onClick={() => setActiveTab("Attendance")}
                >
                    <FiCheckSquare size={30} />
                    {isSidebarOpen && <span>Attendance</span>}
                </button>
                <button
                    className="flex items-center space-x-4 w-full p-3 rounded-md text-lg hover:bg-red-600"
                    onClick={handleLogout}
                >
                    <FiLogOut size={30} />
                    {isSidebarOpen && <span>Logout</span>}
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
