import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./CSS/index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/Store.jsx";
import ThemeProvider from "./Components/UI/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
