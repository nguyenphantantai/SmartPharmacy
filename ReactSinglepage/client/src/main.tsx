import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/debug-env";

createRoot(document.getElementById("root")!).render(<App />);
