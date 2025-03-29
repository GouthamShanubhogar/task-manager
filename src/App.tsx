import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Signup from "./pages/auth/signup";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Login from "./pages/auth/login";
import { TaskProvider } from "./context/TaskContext";

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route
                            path="/"
                            element={
                                <AuthGuard>
                                    <Dashboard />
                                </AuthGuard>
                            }
                        />
                    </Routes>
                </Router>
            </TaskProvider>
        </AuthProvider>
    );
}

export default App;
