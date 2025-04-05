import { FiMenu, FiUser, FiCheckSquare, FiLogOut } from "react-icons/fi";

interface TopBarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, handleLogout }) => {
    return (
        <div className="bg-gray-900 text-white flex items-center justify-between p-4 shadow-md">
            <button className="p-2 text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <FiMenu size={30} />
            </button>

            <h1 className="text-xl font-bold">{activeTab}</h1>

            <div className="flex space-x-4">
                <button
                    className={`p-2 rounded-md ${activeTab === "Home" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                    onClick={() => setActiveTab("Home")}
                >
                    <FiUser size={24} />
                </button>
                <button
                    className={`p-2 rounded-md ${activeTab === "Attendance" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                    onClick={() => setActiveTab("Attendance")}
                >
                    <FiCheckSquare size={24} />
                </button>
                <button className="p-2 rounded-md hover:bg-red-600 transition" onClick={handleLogout}>
                    <FiLogOut size={24} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
