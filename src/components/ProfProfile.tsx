import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { getDatabase, ref, set, onValue } from "firebase/database";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface AttendanceRecord {
  name: string;
  timestamp: string;
  status: string;
  sessions: string;
}

interface AttendanceData {
  [studentId: string]: AttendanceRecord[];
}

interface ProfProfileProps {
  attendanceByStudent: AttendanceData;
  sortedDates: string[];
}

const ProfProfile: React.FC<ProfProfileProps> = ({ attendanceByStudent, sortedDates }) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const database = getDatabase();

  useEffect(() => {
    const monitoringRef = ref(database, "systemControl/attendance/isMonitoringActive");
    const unsubscribe = onValue(monitoringRef, (snapshot) => {
      setIsMonitoringActive(snapshot.val() || false);
    });
    return () => unsubscribe();
  }, []);

  const handleStartMonitoring = async () => {
    try {
      setLoading(true);
      setStatusMessage("Starting attendance monitoring...");
      await set(ref(database, "systemControl/attendance"), { isMonitoringActive: true });
      setStatusMessage("Attendance monitoring started successfully!");
    } catch (error) {
      setStatusMessage("Error starting attendance monitoring.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      setLoading(true);
      setStatusMessage("Stopping attendance monitoring...");
      await set(ref(database, "systemControl/attendance"), { isMonitoringActive: false });
      setStatusMessage("Attendance monitoring stopped successfully!");
    } catch (error) {
      setStatusMessage("Error stopping attendance monitoring.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const attendancePerDate = sortedDates.map((date: string) => {
    const dateRecords: AttendanceRecord[] = Object.values(attendanceByStudent)
      .flatMap((records) =>
        records.filter((record) => new Date(record.timestamp).toLocaleDateString() === date)
      );

    return {
      date,
      present: dateRecords.filter((r) => r.status.toLowerCase() === "present").length,
      late: dateRecords.filter((r) => r.status.toLowerCase() === "late").length,
      absent: dateRecords.filter((r) => r.status.toLowerCase() === "absent").length,
    };
  });

  const allStatuses = Object.values(attendanceByStudent)
    .flatMap((records) => records.map((r) => r.status.toLowerCase()));

  const statusCounts = { present: 0, late: 0, absent: 0 };
  allStatuses.forEach((status) => {
    if (status in statusCounts) statusCounts[status as keyof typeof statusCounts]++;
  });

  const pieData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 1
      }
    ]
  };

  const barData = {
    labels: sortedDates,
    datasets: [
      { label: 'Present', data: attendancePerDate.map(d => d.present), backgroundColor: '#4CAF50' },
      { label: 'Late', data: attendancePerDate.map(d => d.late), backgroundColor: '#FF9800' },
      { label: 'Absent', data: attendancePerDate.map(d => d.absent), backgroundColor: '#F44336' },
    ]
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold text-center sm:text-left">Professor Dashboard</h2>
      <p className="text-gray-600 text-center sm:text-left">Professor Kathryne Raizen</p>

      {/* Start/Stop Monitoring */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {isMonitoringActive ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-green-600 font-bold text-center">🔵 Monitoring is Running</p>
            <button
              onClick={handleStopMonitoring}
              className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
              disabled={loading}
            >
              {loading ? "Stopping..." : "Stop Monitoring"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg text-white bg-green-700 hover:bg-green-900 transition-all"
          >
            Start Attendance Monitoring
          </button>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold">Confirm Monitoring</h3>
            <p className="text-gray-600 mt-2">Are you sure you want to start monitoring?</p>

            {statusMessage && <p className="mt-2 text-gray-500">{statusMessage}</p>}

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleStartMonitoring}
                className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                disabled={loading}
              >
                {loading ? "Starting..." : "Yes, Start"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-center sm:text-left">Student Attendance Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm h-[400px]">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm h-[400px]">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfProfile;
