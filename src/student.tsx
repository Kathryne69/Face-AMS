import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
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
    const [activeTab, setActiveTab] = useState("Home");
    const [userName, setUserName] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [attendanceSummary, setAttendanceSummary] = useState({
        present: 0,
        late: 0,
        absent: 0,
    });

    useEffect(() => {
        const user = auth.currentUser;

        if (user && user.email) {
            const mappedName = emailToNameMap[user.email];
            if (mappedName) {
                setUserName(mappedName);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                signOut(auth).then(() => navigate("/app"));
            }
        } else {
            setIsAuthorized(false);
            navigate("/app");
        }
    }, [auth, navigate]);

    useEffect(() => {
        if (!userName) return;

        const attendanceRef = ref(db, "Attendance_records");

        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            let present = 0;
            let late = 0;
            let absent = 0;

            if (data) {
                const normalizedTargetName = userName.trim().toLowerCase();

                Object.entries(data).forEach(([_, studentList]: [string, any]) => {
                    Object.keys(studentList).forEach((firebaseNameKey) => {
                        const normalizedFirebaseName = firebaseNameKey.trim().toLowerCase();

                        if (normalizedFirebaseName === normalizedTargetName) {
                            const status = studentList[firebaseNameKey]?.status || "";
                            if (status === "Present") present++;
                            else if (status === "Late") late++;
                            else if (status === "Absent") absent++;
                        }
                    });
                });
            }

            setAttendanceSummary({ present, late, absent });
        });
    }, [db, userName]);

    if (isAuthorized === null) return <p>Checking authorization...</p>;
    if (!isAuthorized) return null;

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate("/app"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="min-h-screen flex flex-col bg-center bg-cover bg-no-repeat bg-fixed bg-[url('/classroom.jpg')]">

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
                <div className="flex-1 p-6 overflow-y-auto">
                    {activeTab === "Home" && (
                        <div className="p-6 bg-white rounded-lg shadow-lg w-full">
                            <h2 className="text-2xl font-semibold">Student Dashboard</h2>
                            <p className="text-gray-600 mt-2">Hello, {userName}!</p>

                            {/* Attendance Summary */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold">Attendance Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    <div className="bg-green-100 p-4 rounded-lg flex flex-col items-center">
                                        <p className="font-semibold text-green-700">Present</p>
                                        <p className="text-lg text-green-600">{attendanceSummary.present}</p>
                                    </div>
                                    <div className="bg-orange-100 p-4 rounded-lg flex flex-col items-center">
                                        <p className="font-semibold text-orange-700">Late</p>
                                        <p className="text-lg text-orange-600">{attendanceSummary.late}</p>
                                    </div>
                                    <div className="bg-red-100 p-4 rounded-lg flex flex-col items-center">
                                        <p className="font-semibold text-red-700">Absent</p>
                                        <p className="text-lg text-red-600">{attendanceSummary.absent}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Attendance" && userName && (
                        <AttendanceList db={db} userName={userName} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
