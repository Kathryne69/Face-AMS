import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Student = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigate("/app"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Welcome, Student!</h1>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                onClick={handleLogout}
            >
                Log Out
            </button>
        </div>
    );
};

export default Student;
