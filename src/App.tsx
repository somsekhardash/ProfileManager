import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import './App.scss';
import { AuthProvider } from './Auth/AuthProvider';
import { Layout } from './Layout';
import { PublicPage } from './PublicPage';
import { LoginPage } from './LoginPage'; 
import {RequireAuth} from './Auth/RequireAuth';
import { ProtectedPage } from './ProtectedPage';
import { HttpProvider } from './Helper/HttpProvider';

function App() {
  return (
    <HttpProvider>
    <AuthProvider>
      <h4>My Dashboard</h4>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <RequireAuth>
                <ProtectedPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
    </HttpProvider>
  );
}

export default App;
