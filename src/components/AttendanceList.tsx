// components/AttendanceList.tsx
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
        const attendanceRef = ref(db, "Attendance_records:"); // Removed colon for correct path

        const unsubscribe = onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            const studentRecords: { timestamp: string; status: string; pattern: string }[] = [];

            if (data) {
                const normalizedTargetName = userName.replace(/\s*,\s*/g, ',').toLowerCase();
                Object.entries(data).forEach(([timestamp, studentList]: [string, any]) => {
                    Object.keys(studentList).forEach((firebaseNameKey) => {
                        const normalizedFirebaseName = firebaseNameKey.replace(/\s*,\s*/g, ',').toLowerCase();
                        if (normalizedFirebaseName === normalizedTargetName) {
                            const studentData = studentList[firebaseNameKey];
                            if (studentData && 'status' in studentData && 'sessions' in studentData) {
                                studentRecords.push({
                                    timestamp,
                                    status: studentData.status,
                                    pattern: studentData.sessions,
                                });
                            }
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
