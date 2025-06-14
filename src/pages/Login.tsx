import axios from "axios";
import { useState } from "react";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name,
        password,
      });
      setMessage("✅ " + res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      // redirect or navigate to chat
    } catch (err: any) {
      setMessage("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 shadow bg-white rounded">
      <h2 className="text-xl mb-4">Login</h2>
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
        onClick={handleLogin}
        className="bg-blue-500 text-white w-full py-2 rounded"
      >
        Login
      </button>
      <p className="mt-2 text-center">{message}</p>
    </div>
  );
};

export default Login;
