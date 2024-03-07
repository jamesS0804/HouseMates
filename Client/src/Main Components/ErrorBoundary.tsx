import { useState, useEffect, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode
}

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const { children } = props
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    console.log('Error Boundary called!')
    const errorHandler = (error:any, info:any) => {
      setHasError(true);
      setError(error);
      setInfo(info);
    };

    const errorEventListener = (event: ErrorEvent) => {
        errorHandler(event.error, event.error);
      };
      
      window.addEventListener('error', errorEventListener);
  
      return () => {
        window.removeEventListener('error', errorEventListener);
      };
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return children;
}