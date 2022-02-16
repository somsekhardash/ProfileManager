
import React from "react";
import { useState, useEffect } from "react";

const HttpContext = React.createContext<any>(null!);

//const HttpProvider = (): [boolean, any, any, (url: string, body: any) => void] => {
function HttpProvider({ children }: any):any {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const makeCall = (url: string, body: any, callback: any) => {
    fetch(url, { ...body })
      .then((res: any) => res.json())
      .then((result: any) => {
        // setIsLoading(false);
        callback(result)
      })
      .catch((err: any) => {
        // setError(err);
      });
  };

  const makeTheCall = (url: string, body: any, callback: any) => {
    // setIsLoading(true);
    makeCall(url, body, callback);
  };

  const setErr = (err: string) =>{
    setError(err);
  }

  const value = {isLoading, error, makeTheCall, setErr};
  
  return (
    <HttpContext.Provider value={value}>{children}</HttpContext.Provider>
  );
}

export { HttpProvider, HttpContext };