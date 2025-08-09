# saviare - centro educativo sag

Este proyecto proporciona una configuración mínima para que React funcione en Vite con Hot Module Replacement (HMR) y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Expansión de la configuración de ESLint

Si estás desarrollando una aplicación de producción, recomendamos usar TypeScript con reglas de linting habilitadas. Revisa la [plantilla de TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para obtener información sobre cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.