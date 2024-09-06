import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  react,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: reactHooks.configs.recommended.rules
  },
  {
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/interface-name-prefix": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": ["error", { ignore: ["class", "fill-rule"] }]
    }
  }
);
