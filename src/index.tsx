import { render } from "preact";
import "./style/index.css";
import App from "./components/app";

const element = document.getElementById("app");
if (element) render(<App />, element);
