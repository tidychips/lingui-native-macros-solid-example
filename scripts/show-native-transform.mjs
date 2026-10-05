/**
 * Dump what `@lingui/native-tools` emits for a Solid `useLingui` + `t` fixture.
 *
 * Expected (Solid / Babel): `const { _: _t } = useLingui(); _t({ id: ... })`
 * Actual (native/SWC):      `const { i18n: $__i18n, ... } = useLingui(); $__i18n._({ id: ... })`
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from '@lingui/native-tools';
import { getConfig } from '@lingui/conf';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fixture = path.join(root, 'src/fixtures/use-lingui-t.tsx');
const code = readFileSync(fixture, 'utf8');
const linguiConfig = getConfig({ cwd: root });

const result = await transform(code, fixture, {
  macro: {
    jsxPackage: linguiConfig.macro.jsxPackage,
    runtimeModules: {
      i18n: linguiConfig.runtimeConfigModule.i18n,
      Trans: linguiConfig.runtimeConfigModule.Trans,
      useLingui: linguiConfig.runtimeConfigModule.useLingui
    }
  }
});

console.log('=== native transform output ===\n');
console.log(result.code);
console.log('\n=== markers ===');
console.log('React-style `$__i18n._(...)` present:', result.code.includes('$__i18n._'));
console.log('Solid accessor `i18n().locale` left intact:', result.code.includes('i18n().locale'));
console.log(
  'Solid-safe `_` helper used for t (Babel does this):',
  /_\w*\(\s*\/\*i18n\*\/|_\w*\(\s*\{\s*id:/.test(result.code.replaceAll('$__i18n._', ''))
);
