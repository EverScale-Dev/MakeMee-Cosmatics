"use client"
import "../styles/globals.css";
import store from "../store/store";
import { Provider } from "react-redux";
import LoadingProvider from "../components/LoadingOverlay";

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
        <LoadingProvider />
          <Provider store={store}>
            {children}
          </Provider>
        <LoadingProvider />
      </body>  
    </html>
  );
}
