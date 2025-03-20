import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

const App = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [role, setRole] = useState("");
    const [professorPassword, setProfessorPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleProfessorLogin = () => {
        if (professorPassword === "6969") {
            navigate("/professor"); // Redirect if correct
        } else {
            setError("Incorrect password! Try again.");
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-200">
            <h1 className="text-4xl font-bold text-green-700 mb-4">Choose Your Role</h1>

            <div className="flex gap-4">
                <button 
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                    onClick={() => navigate("/student")} 
                >
                    Student
                </button>

                <button 
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
                    onClick={() => setRole("professor")}
                >
                    Professor
                </button>
            </div>

            {role === "professor" && (
                <div className="mt-6 flex flex-col items-center">
                    <input 
                        type="password"
                        placeholder="Enter Professor Password"
                        className="border border-gray-400 px-4 py-2 rounded-md"
                        value={professorPassword}
                        onChange={(e) => setProfessorPassword(e.target.value)}
                    />
                    <button 
                        className="mt-3 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
                        onClick={handleProfessorLogin}
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            )}

            <button 
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default App;
