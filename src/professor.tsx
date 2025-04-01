import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import { exportToCSV } from "./utils/exportCsv";
import { fetchAttendanceRecords } from "./utils/getAttendance";
import { checkProfessorEmail } from "./utils/authCheck";

const ProfessorDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile");
    const [attendance, setAttendance] = useState<{ name: string; timestamp: string; status: string; sessions: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Check if user is professor
    useEffect(() => {
        checkProfessorEmail(auth, navigate);
    }, [auth, navigate]);

    // Fetch attendance data
    useEffect(() => {
        if (activeTab === "Attendance") {
            setLoading(true);
            fetchAttendanceRecords(setAttendance, setLoading);
        }
    }, [activeTab]);

    const handleLogout = () => {
        signOut(auth).then(() => navigate("/app")).catch(console.error);
    };

    const filteredAttendance = attendance.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen flex flex-col">
            <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

            <div className="flex flex-grow">
                <Sidebar isSidebarOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                <div className="flex-1 p-6">
                    {activeTab === "Profile" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Profile Section</h2>
                            <p>Professor Kathryne Raizen</p>
                        </div>
                    )}
                    {activeTab === "Attendance" && (
                        <div>
                            <h2 className="text-2xl font-semibold">All Attendance Records</h2>

                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                            />

                            <button
                                onClick={() => exportToCSV(attendance)}
                                className="mt-4 bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                            >
                                Export CSV
                            </button>

                            {loading ? (
                                <p>Loading...</p>
                            ) : filteredAttendance.length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {filteredAttendance.map((record, index) => (
                                        <li key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
                                            <strong>👤 Student:</strong> {record.name} <br />
                                            <strong>📅 Date:</strong> {new Date(record.timestamp).toLocaleString()} <br />
                                            <strong>✅ Status:</strong> {record.status} <br />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No matching attendance records found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessorDashboard;
