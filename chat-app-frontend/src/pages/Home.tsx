import ChatPage from "../components/ChatPage";
import { useUser } from "../context/UserContext";
import Login from "./Login";
import Signup from "./Signup";

export default function Home() {
  const { user, setUser } = useUser();
  // console.log("user ", user);

  return (
    <div>
      {!user?.id ? (
        <>
          <Login />
          <hr />
          <Signup />
        </>
      ) : (
        <>
          <span style={{ color: "green", fontSize: "20px", padding: "0 10px" }}>
            {" "}
            {user.name}{" "}
          </span>{" "}
          <button onClick={() => setUser(null)}>Logout</button>
          <ChatPage />
        </>
      )}
    </div>
  );
}
