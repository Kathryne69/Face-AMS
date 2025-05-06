import { getDatabase, ref, onValue } from "firebase/database";

interface AttendanceRecord {
    name: string;
    timestamp: string;
    status: string;
    sessions: string;
}

export const fetchAttendanceRecords = (
    setAttendance: (data: AttendanceRecord[]) => void,
    setLoading: (loading: boolean) => void
) => {
    const db = getDatabase();
    const attendanceRef = ref(db, "Attendance_records");

    onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let allRecords: AttendanceRecord[] = [];

            Object.entries(data).forEach(([timestamp, studentList]) => {
                Object.entries(studentList as Record<string, { Status: string; Sessions: string }>).forEach(
                    ([studentName, record]) => {
                        allRecords.push({
                            name: studentName, // Corrected to use the key as the name
                            timestamp,
                            status: record.Status || "Unknown", // Handle missing status
                            sessions: record.Sessions || "N/A", // Handle missing sessions
                        });
                    }
                );
            });

            // Sort by newest date first
            allRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setAttendance(allRecords);
        } else {
            setAttendance([]);
        }

        setLoading(false);
    });
};
