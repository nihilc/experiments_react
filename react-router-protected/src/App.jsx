import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Navigation } from "./Navigation";
import * as Pages from "./Pages";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () =>
    setUser({
      id: 1,
      name: "chris",
      permissions: ["analyze"],
      roles: ["admin"],
    });
  const handleLogout = () => setUser(null);

  return (
    <>
      <h1>React Router</h1>

      <Navigation />

      {user ? (
        <button onClick={handleLogout}>Sing Out</button>
      ) : (
        <button onClick={handleLogin}>Sing In</button>
      )}

      <Routes>
        <Route index element={<Pages.Landing />} />
        <Route path="landing" element={<Pages.Landing />} />
        <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route path="home" element={<Pages.Home />} />
          <Route path="dashboard" element={<Pages.Dashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              redirectPath="/home"
              isAllowed={!!user && user.permissions.includes("analyze")}
            />
          }
        >
          <Route path="analytics" element={<Pages.Analytics />} />
        </Route>
        <Route
          element={
            <ProtectedRoute
              redirectPath="/home"
              isAllowed={!!user && user.roles.includes("admin")}
            />
          }
        >
          <Route path="admin" element={<Pages.Admin />} />
        </Route>
        <Route path="*" element={<p>There&apos;s nothing here: 404!</p>} />
      </Routes>
    </>
  );
}

const ProtectedRoute = ({ isAllowed, redirectPath = "/landing", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

export default App;
