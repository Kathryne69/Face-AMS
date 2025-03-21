export const topBar =
    "flex items-center justify-between bg-gray-900 text-white p-4 shadow-md fixed w-full z-20 h-16"; 

export const sidebarContainer = (isSidebarOpen: boolean) =>
    `bg-green-900 text-white w-64 min-h-screen p-4 transition-transform fixed h-full z-10 pt-16 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:relative md:translate-x-0 md:w-64`;

export const sidebarButton = (activeTab: string, tabName: string) =>
    `flex items-center space-x-4 w-full p-3 rounded-md text-lg ${
        activeTab === tabName ? "bg-green-700 text-white" : "hover:bg-green-800"
    }`;

export const mainContent = (isSidebarOpen: boolean) =>
    `flex-1 min-h-screen overflow-auto bg-gray-100 transition-all ${
        isSidebarOpen ? "ml-64" : "ml-0"
    } md:ml-64`; // Sidebar pushes content on large screens

export const contentArea = "p-6 mt-20"; // Push content down to avoid overlap
