// src/components/ProfProfile.tsx
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface AttendanceRecord {
    name: string;
    timestamp: string;
    status: string;
}

interface ProfProfileProps {
    attendanceByStudent: Record<string, AttendanceRecord[]>; 
    sortedDates: string[];
}

const ProfProfile = ({ attendanceByStudent, sortedDates }: ProfProfileProps) => {
    // Data for the Bar chart: attendance status counts per date (Present, Late, Absent)
    const attendancePerDate = sortedDates.map(date => {
        const dateRecords = Object.values(attendanceByStudent).flatMap(records =>
            records.filter(record => new Date(record.timestamp).toLocaleDateString() === date)
        );

        const presentCount = dateRecords.filter(record => record.status.toLowerCase() === "present").length;
        const lateCount = dateRecords.filter(record => record.status.toLowerCase() === "late").length;
        const absentCount = dateRecords.filter(record => record.status.toLowerCase() === "absent").length;

        return {
            date,
            presentCount,
            lateCount,
            absentCount
        };
    });

    // Data for the Pie chart: overall attendance percentage distribution
    const allAttendanceStatuses = Object.values(attendanceByStudent).flatMap((records) =>
        records.map(record => record.status)
    );

    const attendanceCount = {
        present: allAttendanceStatuses.filter(status => status.toLowerCase() === "present").length,
        late: allAttendanceStatuses.filter(status => status.toLowerCase() === "late").length,
        absent: allAttendanceStatuses.filter(status => status.toLowerCase() === "absent").length
    };

    const pieData = {
        labels: ['Present', 'Late', 'Absent'],
        datasets: [{
            data: [attendanceCount.present, attendanceCount.late, attendanceCount.absent],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderWidth: 1
        }]
    };

    const chartData = {
        labels: sortedDates, // Dates as x-axis
        datasets: [
            {
                label: 'Present',
                data: attendancePerDate.map(record => record.presentCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Late',
                data: attendancePerDate.map(record => record.lateCount),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
            {
                label: 'Absent',
                data: attendancePerDate.map(record => record.absentCount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold">Profile Section</h2>
            <p>Professor Kathryne Raizen</p>
    
            <div className="mt-6">
                <h3 className="text-xl font-semibold">Student Attendance Overview</h3>
            </div>
    
            {/* Flex container for side-by-side layout if wide */}
            <div className="flex flex-wrap gap-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[300px]">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Attendance Status per Date',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.raw}`,
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    min: 0,
                                    ticks: {
                                        stepSize: 1,
                                    },
                                },
                            },
                        }}
                        height={400}
                    />
                </div>
    
                {/* Pie Chart */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-[300px]">
                    <Pie
                        data={pieData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Overall Attendance Distribution',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.raw}%`,
                                    },
                                },
                            },
                        }}
                        height={400}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfProfile;
