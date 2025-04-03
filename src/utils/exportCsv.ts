export const exportToCSV = (attendance: { name: string; timestamp: string; status: string; sessions: string }[]) => {
    if (attendance.length === 0) {
        alert("No attendance records to export!");
        return;
    }

    // Group attendance by student and date
    const attendanceByStudent: Record<string, Record<string, string>> = attendance.reduce((acc, record) => {
        const studentName = record.name;
        const date = new Date(record.timestamp).toLocaleDateString(); // Format the date to be used as a column
        if (!acc[studentName]) {
            acc[studentName] = {};
        }
        acc[studentName][date] = record.status; // Assign the status for the specific date
        return acc;
    }, {} as Record<string, Record<string, string>>); // Provide a type for the accumulator

    // Get the sorted list of unique dates from the records and sort from oldest to newest
    const sortedDates = Array.from(new Set(attendance.map(record => new Date(record.timestamp).toLocaleDateString())))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Sorting from oldest to newest

    // Create CSV header
    const csvHeader = ["Student Name", ...sortedDates, "Grade"].join(",") + "\n";

    // Create CSV rows for each student
    const csvRows = Object.entries(attendanceByStudent).map(([student, dates]) => {
        const statuses = sortedDates.map(date => dates[date] || "Absent"); // Use "Absent" if no attendance record exists for a date
        const avgGrade = calculateAvgGrade(statuses); // Calculate the average grade for the student
        return `"${student}",${statuses.map(status => `"${status}"`).join(",")},${avgGrade}%`;
    }).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_records.csv";
    a.click();
    URL.revokeObjectURL(url);
};

// Helper function to calculate the average grade from statuses
const calculateAvgGrade = (statuses: string[]) => {
    const totalPercentage = statuses.reduce((sum, status) => sum + statusToPercentage(status), 0);
    return (totalPercentage / statuses.length).toFixed(2);
};

// Helper function to convert status to percentage
const statusToPercentage = (status: string) => {
    switch (status.toLowerCase()) {
        case "present": return 100;
        case "late": return 85;
        case "absent": return 0;
        default: return 0;
    }
};
