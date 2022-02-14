import React, { useEffect } from 'react';
import { fakeAuthProvider } from "./Auth";
import { UserAuthenticationClient , setCookie, removeCookie } from '../Helper/Cookieshelper';
import axios from "axios";
import { REACT_APP_LOGIN_USER, REACT_APP_VERIFY_USER, REACT_APP_LOGOUT_USER ,REACT_APP_COOKIE1, REACT_APP_COOKIE2, REACT_APP_LOGIN_REDIRECT_URL, REACT_APP_MEMBERSHIP_REDIRECT_URL} from './../config';

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [error, setError] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<any>(null);

  const verifyUser = async (token: string) => {
    try {
      setLoading(true);
      await axios.post(
        REACT_APP_VERIFY_USER as string,
        {"token": token}
      ).then(res => {
        setUser(res.data.data.userName);
      });
    } catch (err) {
      setError("Unexpected Error on VerifyUser Flow!");
    } finally {
      setLoading(false);
    }
  }

  const loginUser = async (userName: string) => {
    try {
      setLoading(true);
      await axios.post(
                  REACT_APP_LOGIN_USER as string,
                  {"userName": userName} )
                .then(res => {
                  setCookie("internal_token", res.data.data.token, 1);
                  console.log();
                  setUser(UserAuthenticationClient.getDecodedToken(res.data.data.token).userName || "test_user@condenast.com");
                })
    }catch (err) {
        setError("Unexpected Error on loginUser Flow!");
    } finally {
        setLoading(false);
    }
  }

  const logoutUser = async (token: string) => {
    try {
      setLoading(true);
      await axios.post(
                  REACT_APP_LOGOUT_USER as string,
                  {"token": token} )
                .then(res => {
                  removeCookie("internal_token");
                  setUser(null);
                })
    }catch (err) {
        setError("Unexpected Error on loginUser Flow!");
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    const authCookie = UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE1}`);
    const subCookie = UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE2}`);
    const internalCookie = UserAuthenticationClient.getDocumentCookie("internal_token");
    if(authCookie) {
      if(subCookie) {
        if(internalCookie) { 
          verifyUser(internalCookie);
        } else {
          loginUser(authCookie);
        }
      } else {
        // window.location.replace(`${REACT_APP_MEMBERSHIP_REDIRECT_URL}`);
        alert("redirect to membership");
      }
    } else {
      // window.location.replace(`${REACT_APP_LOGIN_REDIRECT_URL}`);
      alert("redirect to loginpage");
    }
  }, []);
  
    let signin = (newUser: string, callback: VoidFunction) => {
      return fakeAuthProvider.signin(() => {
        setUser(newUser);
        callback();
      });
    };
  
    let signout = (callback: VoidFunction) => {
      logoutUser(UserAuthenticationClient.getDocumentCookie("internal_token"));
    };

    let onError = (callback: VoidFunction, data: string) => {
        setError(data);
        callback();
    };
  
    let value = { user, signin, signout, loading, onError };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export {AuthProvider , AuthContext};