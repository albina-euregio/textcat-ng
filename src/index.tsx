import { render, h } from "preact";
import "./style/index.css";
import App from "./components/app";

import("./sentry");

const element = document.getElementById("app");
if (element) render(<App />, element);
