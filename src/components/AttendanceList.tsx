import { useState, useEffect } from "react";
import { ref, onValue, Database } from "firebase/database";
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiBookOpen } from "react-icons/fi";

interface AttendanceProps {
    db: Database;
    userName: string | null;
}

const subjects = [
    { key: "section1", name: "CPP122 - CpE Practice and Design 2" },
    { key: "section2", name: "TEC101 - Technopreneurship" },
    { key: "section3", name: "CPE103 - Mobile Embedded System" },
];

const AttendanceList = ({ db, userName }: AttendanceProps) => {
    const [attendance, setAttendance] = useState<{ timestamp: string; status: string; subject: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userName) return;

        setLoading(true);
        const attendanceRef = ref(db, "Attendance_records");

        const unsubscribe = onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            const studentRecords: { timestamp: string; status: string; subject: string }[] = [];

            if (data) {
                const normalizedTargetName = userName.trim().toLowerCase();

                Object.entries(data).forEach(([timestamp, studentList]: [string, any]) => {
                    Object.keys(studentList).forEach((firebaseNameKey) => {
                        const normalizedFirebaseName = firebaseNameKey.trim().toLowerCase();
                        if (normalizedFirebaseName === normalizedTargetName) {
                            const studentData = studentList[firebaseNameKey];
                            const randomSubject = subjects[Math.floor(Math.random() * subjects.length)].name;
                            studentRecords.push({
                                timestamp,
                                status: studentData?.status || "Unknown",
                                subject: randomSubject,
                            });
                        }
                    });
                });
            }

            setAttendance(studentRecords);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userName, db]);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
            <div className="bg-black/40 rounded-2xl shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-3xl font-bold text-white px-4 py-2 rounded-lg shadow-sm inline-block mb-6">
                    Attendance
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-600 border-opacity-50"></div>
                    </div>
                ) : attendance.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {attendance.map((record, index) => {
                            let borderColor = "border-gray-400";
                            let statusColor = "text-gray-600";
                            let statusIcon = <FiXCircle size={18} />;

                            if (record.status === "Present") {
                                borderColor = "border-green-500";
                                statusColor = "text-green-600";
                                statusIcon = <FiCheckCircle size={18} />;
                            } else if (record.status === "Late") {
                                borderColor = "border-yellow-500";
                                statusColor = "text-yellow-600";
                                statusIcon = <FiClock size={18} />;
                            } else if (record.status === "Absent") {
                                borderColor = "border-red-500";
                                statusColor = "text-red-600";
                                statusIcon = <FiXCircle size={18} />;
                            }

                            return (
                                <div
                                    key={index}
                                    className={`bg-white/90 border-l-4 ${borderColor} rounded-xl shadow-sm p-4 sm:p-5 transition duration-300 hover:scale-[1.02]`}
                                >
                                    <div className="flex items-center mb-2 gap-2 text-sm sm:text-base text-gray-800">
                                        <FiCalendar />
                                        <span className="font-medium">{record.timestamp}</span>
                                    </div>
                                    <div className="flex items-center mb-2 gap-2 text-sm sm:text-base text-gray-700">
                                        <FiBookOpen />
                                        <span>{record.subject}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 font-semibold ${statusColor} text-sm sm:text-base`}>
                                        {statusIcon}
                                        <span>{record.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-200 text-lg text-center">No attendance records found.</p>
                )}
            </div>
        </div>
    );
};

export default AttendanceList;
