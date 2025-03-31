import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";

const ProfessorDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile");
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === "Attendance") {
            setLoading(true);
            console.log("Fetching attendance records...");

            const attendanceRef = ref(db, "attendance_records");

            onValue(attendanceRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Firebase Data:", data); // Debugging

                if (data) {
                    const allRecords = [];

                    Object.entries(data).forEach(([timestampKey, studentList]) => {
                        Object.entries(studentList).forEach(([studentName, record]) => {
                            allRecords.push({
                                name: studentName,
                                timestamp: record.timestamp,
                                status: record.status,
                                pattern: record.attendance_pattern,
                            });
                        });
                    });

                    console.log("Processed Attendance Records:", allRecords); // Debugging
                    setAttendance(allRecords);
                } else {
                    console.log("No attendance data found.");
                    setAttendance([]);
                }

                setLoading(false);
            }, (error) => {
                console.error("Firebase Error:", error);
                setLoading(false);
            });
        }
    }, [activeTab, db]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate("/app"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="h-screen flex flex-col">
            <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

            <div className="flex flex-grow">
                <Sidebar isSidebarOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                <div className="flex-1 p-6">
                    {activeTab === "Profile" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Profile Section</h2>
                            <p>Professor profile details...</p>
                        </div>
                    )}
                    {activeTab === "Attendance" && (
                        <div>
                            <h2 className="text-2xl font-semibold">All Attendance Records</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : attendance.length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {attendance.map((record, index) => (
                                        <li key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
                                            <strong>👤 Student:</strong> {record.name} <br />
                                            <strong>📅 Date:</strong> {record.timestamp} <br />
                                            <strong>✅ Status:</strong> {record.status} <br />
                                            <strong>📊 Pattern:</strong> {record.pattern}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No attendance records found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessorDashboard;
