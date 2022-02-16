import React, { useEffect } from 'react';
import {useAuth} from '../Layout';
import {
    useLocation,
    Navigate
  } from "react-router-dom";
import { UserAuthenticationClient } from '../Helper/Cookieshelper';
import { REACT_APP_COOKIE3 } from '../config';

function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();
    const internalCookie = UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE3}`);

    if (!internalCookie) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  
    return children;
}

export {RequireAuth};
