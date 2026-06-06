import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./AppLayout";
import ClientDetails from "./pages/ClientDetails";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Exercises from "./pages/Exercises"
import CreateExercise from "./pages/CreateExercise"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login /> }/>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients/details/:id" element={<ClientDetails />} />
          <Route
            path="/session/:clientName/:sessionId"
            element={<ClientDetails />}
          />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/create" element={<CreateExercise />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
