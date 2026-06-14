import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import "./styles/globals.css";
import "./styles/responsive.css";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a25",
            color: "#e4e4e7",
            border: "1px solid #2a2a3a",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#0a0a0f" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0a0a0f" },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
