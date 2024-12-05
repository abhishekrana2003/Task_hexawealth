import axios from 'axios';
import { useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc'; // Import Google logo icon

export default function SignUp() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const emailData = formData.get('email');
        const passwordData = formData.get('password');

        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
                email: emailData,
                password: passwordData,
            })
            .then((res) => {
                const token = res.data.token;

                // Set the token in a cookie
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                document.cookie = `authToken=${token}; expires=${expires.toUTCString()}; path=/;`;
                navigate('/');
                // re-route from here
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/authGoogle/google`;
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="shadow-md rounded-lg gap-4 p-5 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">Sign Up</div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2 items-center">
                    <div className="flex items-end w-full">
                        <label>Email</label>
                        <input
                            required
                            className="outline-none ml-auto border-b-2 p-2 px-3 focus:bg-gray-100 transition-all"
                            type="text"
                            name="email"
                        />
                    </div>
                    <div className="flex gap-4 items-end">
                        <label>Password</label>
                        <input
                            required
                            className="outline-none border-b-2 p-2 px-3 focus:bg-gray-100 transition-all"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div>
                        <button
                            className="py-2 px-3 bg-blue-500 hover:bg-blue-600 transition-all text-white rounded-md"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        className="py-2 px-3 flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-all text-white rounded-md"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle /> Sign Up with Google
                    </button>
                </div>
            </div>
        </div>
    );
}