import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { lingui } from '@lingui/vite-plugin';
import linguiMacroPlugin from '@lingui/babel-plugin-lingui-macro';
import { getConfig } from '@lingui/conf';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const useNative = process.env.LINGUI_TRANSFORM === 'native';
const linguiConfig = getConfig({ cwd: root });

export default defineConfig({
  define: {
    'import.meta.env.LINGUI_TRANSFORM': JSON.stringify(useNative ? 'native' : 'babel')
  },
  plugins: [
    // Native transform must run before vite-plugin-solid so macros expand first.
    ...(useNative ? [lingui({ cwd: root, macroTransform: true })] : [lingui({ cwd: root })]),
    solid(
      useNative
        ? {}
        : {
            babel: {
              plugins: [[linguiMacroPlugin, { linguiConfig }]]
            }
          }
    )
  ]
});
