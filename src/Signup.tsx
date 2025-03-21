import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const signUpWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setAuthing(true);
        setError('');

        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[url('/classroom.jpg')] bg-cover bg-center bg-no-repeat">
            <div className='w-full max-w-[450px] bg-white shadow-lg rounded-lg p-10 flex flex-col'>
                <h3 className='text-3xl font-bold text-[#1a3d2f] mb-2 text-center'>Sign Up</h3>
                <p className='text-gray-600 text-center mb-6'>Please enter your details.</p>

                <div className='w-full flex flex-col mb-6'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full text-gray-800 py-2 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full text-gray-800 py-2 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        className='w-full text-gray-800 py-2 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <div className='text-red-500 mb-4 text-center'>{error}</div>}

                <button
                    className='w-full bg-gray-100 text-gray-800 font-semibold rounded-md p-3 text-center flex items-center justify-center cursor-pointer hover:bg-[#219638] hover:text-white transition'
                    onClick={signUpWithEmail}
                    disabled={authing}
                >
                    Sign Up
                </button>

                <div className='w-full flex items-center justify-center relative py-4'>
                    <div className='w-full h-[1px] bg-gray-300'></div>
                    <p className='text-sm absolute text-gray-500 bg-white px-2'>OR</p>
                </div>

                <button
                    className='w-full bg-gray-100 text-gray-800 font-semibold rounded-md p-3 text-center flex items-center justify-center cursor-pointer hover:bg-[#219638] hover:text-white transition'
                    onClick={signUpWithGoogle}
                    disabled={authing}
                >
                    Sign Up With Google
                </button>

                <div className='w-full flex items-center justify-center mt-6'>
                    <p className='text-sm font-normal text-gray-600'>Already have an account? 
                        <span className='font-semibold text-gray-800 cursor-pointer underline ml-1'>
                            <a href='#/login'>Log In</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
