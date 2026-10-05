/// <reference types="vite/client" />

declare module '*.po' {
  export const messages: Record<string, string>;
}

interface ImportMetaEnv {
  readonly LINGUI_TRANSFORM?: 'babel' | 'native';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
