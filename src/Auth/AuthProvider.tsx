import React, { useEffect } from 'react';
import { fakeAuthProvider } from "./Auth";
import { UserAuthenticationClient , setCookie, removeCookie } from '../Helper/Cookieshelper';
import axios from "axios";

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [error, setError] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<any>(null);

  const verifyUser = async (token: string) => {
    console.log(token);
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8000/verify",
        {"token": token}
      ).then(res => {
        console.log(`${res.data.data.userName} userName`);
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
                  "http://localhost:8000/login-user",
                  {"userName": userName} )
                .then(res => {
                  setCookie("internal_token", res.data.data.token, 1);
                  setUser(res.data.data.userName);
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
                  "http://localhost:8000/logout-user",
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

  // "username" - existing one
  // "internal_token" - new one we are creating 

  useEffect(() => {
    if(UserAuthenticationClient.getDocumentCookie("username")) {
      if(UserAuthenticationClient.getDocumentCookie("internal_token")) { 
        verifyUser(UserAuthenticationClient.getDocumentCookie("internal_token"));
      } else {
        loginUser(UserAuthenticationClient.getDocumentCookie("username"));
      }
    } else {
      alert("No User InfoFound Please Set The User");
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