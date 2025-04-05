import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import { exportToCSV } from "./utils/exportCsv";
import { fetchAttendanceRecords } from "./utils/getAttendance";
import { checkProfessorEmail } from "./utils/authCheck";
import ProfProfile from "./components/ProfProfile";

interface AttendanceRecord {
    name: string;
    timestamp: string;
    status: string;
    sessions: string;
}

const statusToPercentage = (status: string) => {
    switch (status.toLowerCase()) {
        case "present": return 100;
        case "late": return 85;
        case "absent": return 0;
        default: return 0;
    }
};

const ProfessorDashboard = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("Home"); // Default to "Profile"
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        checkProfessorEmail(auth, navigate);
    }, [auth, navigate]);

    useEffect(() => {
        if (activeTab === "Attendance") {
            setLoading(true);
            fetchAttendanceRecords(setAttendance, setLoading); // ✅ Fix function call
        }
    }, [activeTab]);

    const handleLogout = () => {
        signOut(auth).then(() => navigate("/app")).catch(console.error);
    };

    const filteredAttendance = attendance.filter(record =>
        record.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group attendance by student
    const attendanceByStudent: Record<string, AttendanceRecord[]> = {};
    filteredAttendance.forEach(record => {
        if (!attendanceByStudent[record.name]) {
            attendanceByStudent[record.name] = [];
        }
        attendanceByStudent[record.name].push(record);
    });

    // Sort students alphabetically by name
    const sortedStudentNames = Object.keys(attendanceByStudent).sort();

    // Get unique sorted dates
    const sortedDates = Array.from(
        new Set(filteredAttendance.map(record => new Date(record.timestamp).toLocaleDateString()))
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const calculateAvgGrade = (statuses: string[]) => {
        if (statuses.length === 0) return "0.00";
        const totalPercentage = statuses.reduce((sum, status) => sum + statusToPercentage(status), 0);
        return (totalPercentage / statuses.length).toFixed(2);
    };

    // Define sections with unique names
    const attendanceSections = [
        { key: "section1", name: "CPP122 - CpE Practice and Design 2" },
        { key: "section2", name: "TEC101 - Technopreneurship" },
        { key: "section3", name: "CPE103 - Mobile Embedded System" },
    ];

    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        section1: true,
        section2: true,
        section3: true
    });

    const toggleCollapse = (sectionKey: string) => {
        setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-center bg-cover bg-no-repeat bg-fixed bg-[url('/classroom.jpg')]">

            <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

            <div className="flex flex-grow">
                <Sidebar isSidebarOpen={isSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />

                <div className="flex-1 p-6">
                    {activeTab === "Home" && (
                        <ProfProfile
                            attendanceByStudent={attendanceByStudent}
                            sortedDates={sortedDates}
                        />
                    )}

                    {activeTab === "Attendance" && attendanceSections.map(({ key, name }) => (
                        <div key={key} className="p-4 sm:p-6 bg-white bg-opacity-90 rounded-lg shadow-lg mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                    {collapsedSections[key] ? name : "Attendance Records"}
                                </h2>
                                <button 
                                    onClick={() => toggleCollapse(key)} 
                                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                >
                                    {collapsedSections[key] ? "⋯" : "⋯"}
                                </button>
                            </div>

                            {!collapsedSections[key] && (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Search student..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="p-2 border border-gray-400 rounded-md w-full sm:w-1/3"
                                        />
                                        <button
                                            onClick={() => exportToCSV(filteredAttendance)}
                                            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                        >
                                            Export CSV
                                        </button>
                                    </div>

                                    {loading ? (
                                        <p className="text-gray-700 mt-4">Loading...</p>
                                    ) : filteredAttendance.length > 0 ? (
                                        <div className="overflow-x-auto mt-4">
                                            <table className="min-w-full border border-gray-300 bg-white rounded-lg text-sm sm:text-base">
                                                <thead>
                                                    <tr className="bg-gray-200 text-gray-900">
                                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Student</th>
                                                        {sortedDates.map(date => (
                                                            <th key={date} className="border border-gray-300 px-2 sm:px-4 py-2 text-left whitespace-nowrap">{date}</th>
                                                        ))}
                                                        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Grade</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedStudentNames.map((student, idx) => {
                                                        const records = attendanceByStudent[student];
                                                        const statusesByDate = sortedDates.map(date => {
                                                            const record = records.find(r => new Date(r.timestamp).toLocaleDateString() === date);
                                                            return record ? record.status : "Absent";
                                                        });

                                                        const avgGrade = calculateAvgGrade(statusesByDate);

                                                        return (
                                                            <tr key={student} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{student}</td>
                                                                {statusesByDate.map((status, index) => (
                                                                    <td key={index} className="border border-gray-300 px-2 sm:px-4 py-2">{status}</td>
                                                                ))}
                                                                <td className="border border-gray-300 px-2 sm:px-4 py-2 font-bold">{avgGrade}%</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 mt-4">No matching attendance records found.</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessorDashboard;
