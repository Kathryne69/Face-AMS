import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import TopBar from "./components/topbar";

const StudentDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile");
    const [attendance, setAttendance] = useState<{ timestamp: string; status: string; pattern: string }[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const emailToNameMap: { [key: string]: string } = {
        "student1@face.ams": "Dela Pieza, Mark Jaspher",
        "student2@face.ams": "Navarro, Jules Rhenz",
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            console.log("Logged-in Email:", user.email);
            const mappedName = emailToNameMap[user.email || ""] || null;
            console.log("Mapped Name:", mappedName);
            setUserName(mappedName);
        }
    }, [auth]);

    useEffect(() => {
        if (activeTab === "Attendance" && userName) {
            setLoading(true);
            const attendanceRef = ref(db, "attendance_records");

            onValue(attendanceRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Fetched Data:", data);

                if (data) {
                    const studentRecords: { timestamp: string; status: string; pattern: string }[] = [];

                    Object.entries(data).forEach(([_, studentList]: any) => { // ✅ FIXED HERE
                        if (studentList[userName]) {
                            console.log("Matched Record:", studentList[userName]);

                            studentRecords.push({
                                timestamp: studentList[userName].timestamp,
                                status: studentList[userName].status,
                                pattern: studentList[userName].attendance_pattern,
                            });
                        }
                    });

                    setAttendance(studentRecords);
                } else {
                    setAttendance([]);
                }
                setLoading(false);
            }, (error) => {
                console.error("Firebase Error:", error);
                setLoading(false);
            });
        }
    }, [activeTab, userName, db]);

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
                            <p>Welcome, {userName || "Student"}!</p>
                        </div>
                    )}
                    {activeTab === "Attendance" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Attendance Records</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : attendance.length > 0 ? (
                                <ul className="mt-4 space-y-4">
                                    {attendance.map((record, index) => (
                                        <li key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
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

export default StudentDashboard;
