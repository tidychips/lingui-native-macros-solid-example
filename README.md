# Lingui native macro transform × Solid repro

Minimal reproduction that `@lingui/vite-plugin`'s experimental `macroTransform: true` emits **React-style** `useLingui` codegen that breaks under `@lingui/solid`.

## Bug

Using `@lingui/babel-plugin-lingui-macro`, the `useLingui()` macro with a config of `macro.jsxRuntime: "solid"` is rewritten as:

```ts
const { t } = useLingui();
t({ message: 'Hello from Solid' });

// ↓ ↓ ↓ ↓ ↓ ↓

const { _: _t } = useLingui();
_t({ id: '...' });
```

If this setup is changed to remove the babel plugin and rely on lingui with `macroTransform: true`, it generates:

```ts
const { i18n: $__i18n, _: $__ } = useLingui();
$__i18n._({ id: '...' });
```

Which crashes at runtime, because `$__i18n` is an accessor function, throwing:

```text
TypeError: $__i18n._ is not a function
```

The correct code should be:

```ts
const { _: $__ } = useLingui();
$__({ id: '...' });
```

There's two factors that cause this invalid code to be generated:

1. `@lingui/native-tools` [disregards `macro.jsxRuntime` Lingui config option](https://github.com/lingui/swc-plugin/blob/b0bf9da86158064f9639fd8a1eb431e108a635ea/crates/lingui_macro/src/options.rs#L34-L53). This appears as an artifact of having the extractor be the foundation for the transformer, and the extractor correctly does not need to concern itself with the particular framework in use.
2. The transformer in `@lingui/native-tools` is [hard-coded to emit the React version](https://github.com/lingui/swc-plugin/blob/b0bf9da86158064f9639fd8a1eb431e108a635ea/crates/lingui_macro/src/lib.rs#L258) of the `t` macro from `useLingui`

## Requirements

- Node.js `>= 22.19` (`@lingui/native-tools` requirement)

## Setup

```bash
npm install
```

## Fastest check (no browser)

Print the native transform for the Solid fixture:

```bash
npm run show:native-transform
```

Look for `$__i18n._(...)` in the output.

## Runtime check

Babel path (works — greeting renders):

```bash
npm run dev:babel
```

Native path (fails — console shows `TypeError: $__i18n._ is not a function`):

```bash
npm run dev:native
```

Open the printed localhost URL. The page should show the greeting under Babel and throw under native.
