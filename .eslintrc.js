const path = require("path")

module.exports = exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  extends: ["airbnb", "cleanjs", "plugin:lodash-fp/recommended", "prettier"],
  plugins: ["lodash-fp"],
  settings: {
    "import/resolver": {
      node: { paths: path.resolve(__dirname + "/src") }
    }
  },
  rules: {
    strict: 2,
    semi: [2, "never"],
    quotes: [2, "single", "avoid-escape"],
    "comma-dangle": ["error", "never"],
    "fp/no-mutation": [
      "error",
      {
        commonjs: true
      }
    ],
    "react/jsx-filename-extension": [1, { extensions: [".js"] }],
    // "import/no-extraneous-dependencies": "off",
    // "import/prefer-default-export": "off",
    "no-bitwise": "off",
    // "react/prop-types": "off",
    // "react/prefer-stateless-function": "off",
    "lodash-fp/consistent-name": ["error", "fp"]
  }
}
