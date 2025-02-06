module.exports = {
  "extends": [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "prettier"
  ],

    "rules": {
      "import/order": "off", // Disable import order rule
      "padding-line-between-statements": "off", // Disable blank line requirements
      "newline-before-return": "off", // Disable newline before return
      "lines-around-comment": "off", // Disable lines around comments
      "import/newline-after-import": "off" // Disable newline after imports

  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/parsers": {},
    "import/resolver": {
      "node": {},
      "typescript": {
        "project": "./jsconfig.json"
      }
    }
  },
  "overrides": []
};