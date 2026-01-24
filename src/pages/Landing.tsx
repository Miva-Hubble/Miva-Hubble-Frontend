import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Miva Hubble</h1>
      <p className="text-gray-600 mb-8">Connecting developers, sharing resources.</p>
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link 
          to="/signup" 
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
