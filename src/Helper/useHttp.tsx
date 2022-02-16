
import { useState, useEffect } from "react";

const useHttp = (): [boolean, any, any, (url: string, body: any) => void] => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const makeCall = (url: string, body: any) => {
    fetch(url, { ...body })
      .then((res: any) => res.json())
      .then((result: any) => {
        setIsLoading(false);
        setData(result);
      })
      .catch((err: any) => {
        setError(err);
      });
  };

  const makeTheCall = (url: string, body: any) => {
    setIsLoading(true);
    makeCall(url, body);
  };

  return [isLoading, data, error, makeTheCall];
};

export default useHttp;