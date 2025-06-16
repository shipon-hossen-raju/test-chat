import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";

function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <UserProvider>
        <Home />
      </UserProvider>
    </div>
  );
}

export default App;
