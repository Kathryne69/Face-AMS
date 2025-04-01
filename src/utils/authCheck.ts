import { Auth } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";

export const checkProfessorEmail = (auth: Auth, navigate: NavigateFunction) => {
    const user = auth.currentUser;
    if (!user || user.email !== "professor@face.ams") {
        navigate("/app");
    }
};
