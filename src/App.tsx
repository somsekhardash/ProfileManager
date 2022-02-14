import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import { AuthProvider } from './Auth/AuthProvider';
import { Layout } from './Layout';
import { PublicPage } from './PublicPage';
import { LoginPage } from './LoginPage'; 
import {RequireAuth} from './Auth/RequireAuth';
import { ProtectedPage } from './ProtectedPage';

function App() {
  return (
    <AuthProvider>
      <h4>My Dashboard</h4>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <ProtectedPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    
    </AuthProvider>
  );
}

export default App;
