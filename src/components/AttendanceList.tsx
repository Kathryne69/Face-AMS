import { useState, useEffect } from "react";
import { ref, onValue, Database } from "firebase/database";

interface AttendanceProps {
    db: Database;
    userName: string | null;
}

const AttendanceList = ({ db, userName }: AttendanceProps) => {
    const [attendance, setAttendance] = useState<{ timestamp: string; status: string; pattern: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userName) return;

        setLoading(true);
        const attendanceRef = ref(db, "Attendance_records"); // Corrected Firebase path

        const unsubscribe = onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            const studentRecords: { timestamp: string; status: string; pattern: string }[] = [];

            if (data) {
                // Normalize the student's name for comparison
                const normalizedTargetName = userName.trim().toLowerCase();
                
                Object.entries(data).forEach(([timestamp, studentList]: [string, any]) => {
                    Object.keys(studentList).forEach((firebaseNameKey) => {
                        const normalizedFirebaseName = firebaseNameKey.trim().toLowerCase();
                        if (normalizedFirebaseName === normalizedTargetName) {
                            const studentData = studentList[firebaseNameKey];
                            studentRecords.push({
                                timestamp,
                                status: studentData?.status || "Unknown", // Default if missing
                                pattern: studentData?.sessions || "N/A",  // Default if missing
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
    );
};

export default AttendanceList;
