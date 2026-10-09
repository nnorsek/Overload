import "./App.css";
import CreateSession from "@/pages/CreateSession.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./AppLayout";
import ClientDetails from "./pages/ClientDetails";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Exercises from "./pages/Exercises";
import CreateExercise from "./pages/CreateExercise";
import Workouts from "./pages/Workouts";
import CreateWorkout from "./pages/CreateWorkout";
import AddExercisesToWorkout from "./pages/AddExercisesToWorkout";
import Sessions from "./pages/Sessions.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients/details/:id" element={<ClientDetails />} />
          <Route
            path="/session/:clientName/:sessionId"
            element={<ClientDetails />}
          />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="sessions/create" element={<CreateSession /> } />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/create" element={<CreateExercise />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/create" element={<CreateWorkout />} />
          <Route
            path="/workouts/:id/exercises"
            element={<AddExercisesToWorkout />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
