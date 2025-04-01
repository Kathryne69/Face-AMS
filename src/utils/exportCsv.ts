export const exportToCSV = (attendance: { name: string; timestamp: string; status: string; sessions: string }[]) => {
    if (attendance.length === 0) {
        alert("No attendance records to export!");
        return;
    }

    const csvHeader = "Student Name,Date,Status,Sessions\n";
    const csvRows = attendance.map(record =>
        `"${record.name}","${new Date(record.timestamp).toLocaleString()}","${record.status}","${record.sessions}"`
    ).join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_records.csv";
    a.click();
    URL.revokeObjectURL(url);
};
