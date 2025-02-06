module.exports = {
  "extends": [
    "next/core-web-vitals",
    "plugin:import/recommended",
    "prettier"
  ],
  "rules": {
   '@next/next/google-font-display': 'off',

    // Disable the rule for using preconnect with Google Fonts
    '@next/next/google-font-preconnect': 'off',

    // Disable rule to enforce inline script ids
    '@next/next/inline-script-id': 'off',

    // Disable rule for preventing assignment to module variable
    '@next/next/no-assign-module-variable': 'off',

    // Disable rule for preventing async client components
    '@next/next/no-async-client-component': 'off',

    // Disable rule for preventing script usage outside of _document.js
    '@next/next/no-before-interactive-script-outside-document': 'off',

    // Disable rule for preventing usage of <img> elements
    '@next/next/no-img-element': 'off',

    // Disable rule for preventing custom fonts in pages
    '@next/next/no-page-custom-font': 'off',

    // Disable rule for preventing usage of <script> in next/head
    '@next/next/no-script-component-in-head': 'off',

    // Disable rule for preventing duplicate <Head> usage
    '@next/next/no-duplicate-head': 'off',

    // Disable rule for preventing <title> in document head
    '@next/next/no-title-in-document-head': 'off',

    // Disable rule for common typos in Next.js's data fetching functions
    '@next/next/no-typos': 'off',

    // Disable rule for preventing unwanted polyfills
    '@next/next/no-unwanted-polyfillio': 'off',
      "import/order": "off", // Disables the import order rule
      "padding-line-between-statements": "off", // Disables blank line requirements

    "jsx-a11y/alt-text": "off",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "@next/next/no-img-element": "off",
    "@next/next/no-page-custom-font": "off",
    "lines-around-comment": [
      "error",
      {
        "beforeBlockComment": true,
        "beforeLineComment": true,
        "allowBlockStart": true,
        "allowObjectStart": true,
        "allowArrayStart": true
      }
    ],
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "any",
        "prev": "export",
        "next": "export"
      },
      {
        "blankLine": "always",
        "prev": [
          "const",
          "let",
          "var"
        ],
        "next": "*"
      },
      {
        "blankLine": "any",
        "prev": [
          "const",
          "let",
          "var"
        ],
        "next": [
          "const",
          "let",
          "var"
        ]
      },
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "function",
          "multiline-const",
          "multiline-block-like"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "function",
          "multiline-const",
          "multiline-block-like"
        ],
        "next": "*"
      }
    ],
    "newline-before-return": "error",
    "import/newline-after-import": [
      "error",
      {
        "count": 1
      }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          [
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          [
            "object",
            "unknown"
          ]
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "next/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "~/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": [
          "react",
          "type"
        ],
        "newlines-between": "always-and-inside-groups"
      }
    ]
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