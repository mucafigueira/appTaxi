import { useEffect, useState } from "react";
import Router from "./routes/Router";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [loading, setLoading] = useState(true);


  /*Exibir o splash em 3 segundo */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  //Splash
  if (loading) {
    return <SplashScreen />
  }
  /*Sistema */
  return <Router />
}


