import { Link} from "react-router-dom";
import RumosLogo from "@/assets/Rumos.svg";
import { useAuth } from "@/hooks/useAuth";
export default function Navbar() {
    const {token, logout} = useAuth();

    async function handleLogout() {
        logout();
    }

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-white text-lg font-bold flex items-center">
                    <img src={RumosLogo} alt="Rumos Logo" className="h-8" />
                    <span className="ml-2">Final Project</span>
                </Link>
                <div>
                    <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                    <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</Link>
                    <Link to="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
                                     {token ? (
                        <>
                          <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                           <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                        </>
                   ):(
                    <>
                      <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                      <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                    </>
                    )
                    }
                </div>
            </div>
        </nav>
    );
}