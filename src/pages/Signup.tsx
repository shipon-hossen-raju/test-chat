import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
    const { setUser } = useUser();

   const handleSignup = async () => {
     const userData = {
      name,
         password,
      }
      
      console.log("userData ", userData);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userData
       );
       setUser(res.data.user);
      setMessage("✅ " + res.data.message);
    } catch (err: any) {
      setMessage("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 shadow bg-white rounded">
      <h2 className="text-xl mb-4">Signup</h2>
      <input
        className="border w-full p-2 mb-2"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border w-full p-2 mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-green-500 text-white w-full py-2 rounded"
      >
        Signup
      </button>
      <p className="mt-2 text-center">{message}</p>
    </div>
  );
};

export default Signup;
