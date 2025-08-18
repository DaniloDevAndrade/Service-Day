import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // ✅ Ignorar arquivos globalmente
    ignores: [
      "src/generated/**", // código gerado do Prisma
      "node_modules/**",
      ".next/**",
    ],
  },

  // ✅ Regras principais (Next.js e TypeScript)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    // ✅ Regras adicionais personalizadas
    rules: {
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
