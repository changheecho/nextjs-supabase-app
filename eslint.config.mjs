import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 제외할 파일 및 폴더
  {
    ignores: [
      ".next/",
      "out/",
      "dist/",
      "build/",
      "node_modules/",
      ".git/",
      "*.config.js",
      "*.config.ts",
      ".husky/",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Tailwind CSS 플러그인 규칙
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      tailwindcss,
    },
    rules: {
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/classnames-order": "off", // Prettier가 담당
    },
  },
  // Import 플러그인 규칙 (import 순서 강제)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // 공통 규칙: console.log, unused-vars, explicit-any 경고
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Prettier 충돌 방지 (마지막에 위치해야 함)
  prettier,
];

export default eslintConfig;
