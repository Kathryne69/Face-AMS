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
    const attendanceRef = ref(db, "Attendance_records:");

    onValue(attendanceRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let allRecords: AttendanceRecord[] = [];

            Object.entries(data).forEach(([timestamp, studentList]) => {
                Object.entries(studentList as Record<string, { name: string; status: string; sessions: string }>).forEach(([, record]) => {
                    allRecords.push({
                        name: record.name,
                        timestamp,
                        status: record.status,
                        sessions: record.sessions,
                    });
                });
            });

            allRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setAttendance(allRecords);
        } else {
            setAttendance([]);
        }

        setLoading(false);
    });
};
