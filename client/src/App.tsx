import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./AppLayout";
import ClientDetails from "./pages/ClientDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients/details/:id" element={<ClientDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
