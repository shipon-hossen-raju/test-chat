import ChatWindow from "../components/ChatWindow";
import { useUser } from "../context/UserContext";
import Login from "./Login";
import Signup from "./Signup";

export default function Home() {
  const { user, setUser } = useUser();
  console.log("user ", user);

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
          <button onClick={() => setUser(null)}>Logout</button>
          <ChatWindow />
        </>
      )}
    </div>
  );
}
