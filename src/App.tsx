import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentIcon from "/stud.png";
import professorIcon from "/prof.png";
import background from "/classroom.jpg";

const App = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [passcode, setPasscode] = useState("");

    const handleRoleSelection = (role: string) => {
        if (role === "professor") {
            setShowModal(true);
            return;
        }
        proceedToLogin(role);
    };

    const proceedToLogin = (role: string) => {
        setSelectedRole(role);
        localStorage.setItem("role", role);
        navigate("/login");
    };

    const handlePasscodeSubmit = () => {
        if (passcode === "pass") {
            setShowModal(false);
            proceedToLogin("professor");
        } else {
            alert("Incorrect passcode!");
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{ backgroundImage: `url(${background})` }} >
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1a3d2f] mb-4 text-center">
                    Welcome to AMS
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Please select your role to proceed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
                    <div
                        className={`w-full h-56 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer transition ${
                            selectedRole === "professor"
                                ? "border-orange-500 bg-orange-50 shadow-md"
                                : "border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                        }`}
                        onClick={() => handleRoleSelection("professor")}
                    >
                        <img src={professorIcon} alt="Professor" className="w-28 h-28 mb-2" />
                        <p className="text-lg font-semibold text-gray-700">Professor</p>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Are you really a Professor?
                        </h3>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Goodluck!"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handlePasscodeSubmit}
                                className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
