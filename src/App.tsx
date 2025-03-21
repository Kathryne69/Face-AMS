import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentIcon from "/stud.png";
import professorIcon from "/prof.png";
import background from "/classroom.jpg";

const App = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const handleRoleSelection = (role: string) => {
        setSelectedRole(role);
        localStorage.setItem("role", role);
        navigate("/login");
    };

    return (
        <div 
            className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${background})` }} 
        >
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1a3d2f] mb-4 text-center">Select User Type</h3>
                <p className="text-gray-600 text-center mb-6">Please select your role to proceed.</p>
                
                {/* Responsive Layout: Stack on mobile, side-by-side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {/* Student Card */}
                    <div
                        className={`w-full h-56 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition ${
                            selectedRole === "student"
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                        }`}
                        onClick={() => handleRoleSelection("student")}
                    >
                        <img src={studentIcon} alt="Student" className="w-28 h-28 mb-2" />
                        <p className="text-lg font-semibold text-gray-700">Student</p>
                    </div>

                    {/* Professor Card */}
                    <div
                        className={`w-full h-56 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition ${
                            selectedRole === "professor"
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                        onClick={() => handleRoleSelection("professor")}
                    >
                        <img src={professorIcon} alt="Professor" className="w-28 h-28 mb-2" />
                        <p className="text-lg font-semibold text-gray-700">Professor</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
