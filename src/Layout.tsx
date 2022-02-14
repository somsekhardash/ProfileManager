import React from 'react';
import {
  Link,
  useNavigate,
  Outlet
} from "react-router-dom";

import {AuthContext} from './Auth/AuthProvider';

function useAuth() {
    return React.useContext(AuthContext);
}

function Layout() {
    return (
      <div>
        <AuthStatus />
        <ul>
          <li>
            <Link to="/">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>  
        <Outlet />
      </div>
    );
}


function AuthStatus() {
    let auth: any = useAuth();
    let navigate = useNavigate();
  
    if (!auth.user) {
      return <p>You are not logged in.</p>;
    }
  
    return (
      <p>
        Welcome {auth.user}!{" "}
        <button
          onClick={() => {
            auth.signout(() => navigate("/"));
          }}
        >
          Sign out
        </button>
      </p>
    );
}

export { Layout, useAuth };