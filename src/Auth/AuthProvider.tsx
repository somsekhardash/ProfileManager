import React, { useEffect } from 'react';
import { fakeAuthProvider } from "./Auth";
import { UserAuthenticationClient , setCookie, removeCookie } from '../Helper/Cookieshelper';
import axios from "axios";
import { REACT_APP_LOGIN_USER, REACT_APP_VERIFY_USER, REACT_APP_LOGOUT_USER, REACT_APP_GRAPHQL ,REACT_APP_COOKIE1, REACT_APP_COOKIE2, REACT_APP_LOGIN_REDIRECT_URL, REACT_APP_MEMBERSHIP_REDIRECT_URL, REACT_APP_COOKIE3} from './../config';

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  let [error, setError] = React.useState<any>(null);
  let [loading, setLoading] = React.useState<any>(null);
  
  const verifyUser = async (token: string) => {
    if(REACT_APP_GRAPHQL) {
      const requestBody = {
          query: `query {
            validate(validateInput:{
              token: "${token}"
          }){
              email,
              exp
            }
          }
          `
      }
      fetch(REACT_APP_GRAPHQL as string, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
              'Content-Type': 'application/json'
          } 
      }).then(res => res.json()).then((res:any)=> {
          const data = res.data.validate;
          setUser(data.email);
      });
    } else {
      try {
        setLoading(true);
        await axios.post(
          REACT_APP_VERIFY_USER as string,
          {"token": token}
        ).then(res => {
          console.log(res);
          setUser(res.data.data.email);
        });
      } catch (err) {
        setError("Unexpected Error on VerifyUser Flow!");
      } finally {
        setLoading(false);
      }
    }
  }

  
  const loginUser = async (authCookie: string, subCookie: string) => {
    if(REACT_APP_GRAPHQL) {
      const requestBody = {
          query: `mutation {
              login(loginInput: {
                cn_token: "${authCookie}",
                pay_ent_pass: "${subCookie}"
              }), {
                token,
                email,
                auth_role
              }
            }
          `
      }
      fetch(REACT_APP_GRAPHQL as string, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
              'Content-Type': 'application/json'
          } 
      }).then(res => res.json()).then((res:any)=> {
          const data = res.data.login;
          setCookie(`${REACT_APP_COOKIE3}`, data.token, 1);
          setUser(data.email);
      });
    } else {
      try {
        setLoading(true);
        await axios.post(REACT_APP_LOGIN_USER as string,{"cn_token": authCookie,"pay_ent_pass":subCookie})
            .then(res => {
                console.log(res);
                setCookie(`${REACT_APP_COOKIE3}`, res.data.data.token, 1);
                setUser(res.data.data.email);
            })
      } catch (err) {
          setError("Unexpected Error on loginUser Flow!");
      } finally {
          setLoading(false);
      }
    }
  }

  const logoutUser = async (token: string) => {
    try {
      setLoading(true);
      await axios.post(
                  REACT_APP_LOGOUT_USER as string,
                  {"token": token} )
                .then(res => {
                  removeCookie(`${REACT_APP_COOKIE3}`);
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
    const internalCookie = UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE3}`);
    if(authCookie) {
      if(subCookie) {
        if(internalCookie) { 
          verifyUser(internalCookie);
        } else {
          loginUser(authCookie,subCookie);
        }
      } else {
        // window.location.replace(`${REACT_APP_MEMBERSHIP_REDIRECT_URL}`);
        window.location.assign(REACT_APP_MEMBERSHIP_REDIRECT_URL as string);
        //alert("redirect to membership");
      }
    } else {
      // window.location.replace(`${REACT_APP_LOGIN_REDIRECT_URL}`);
      // alert("redirect to loginpage");
      window.location.assign(REACT_APP_LOGIN_REDIRECT_URL as string);
    }
  }, []);
  
    let signin = (newUser: string, callback: VoidFunction) => {
      return fakeAuthProvider.signin(() => {
        setUser(newUser);
        callback();
      });
    };
  
    let signout = (callback: VoidFunction) => {
      logoutUser(UserAuthenticationClient.getDocumentCookie(`${REACT_APP_COOKIE3}`));
    };

    let onError = (callback: VoidFunction, data: string) => {
        setError(data);
        callback();
    };
  
    let value = { user, signin, signout, loading, onError };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export {AuthProvider , AuthContext};