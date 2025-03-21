import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
    children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login'); // Redirect to login if user is not authenticated
            } else {
                setUser(user);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth, navigate]); // ✅ Added `navigate` to dependencies

    if (loading) return <p>Loading...</p>;

    return user ? <div>{children}</div> : null; // ✅ Ensures only authenticated users see content
};

export default AuthRoute;
