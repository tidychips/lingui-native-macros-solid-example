import { useLingui } from '@lingui/solid/macro';

/**
 * Minimal Solid + Lingui surface that exercises the `useLingui` macro's `t`
 * rewrite — the path that native/SWC emits as React-style `i18n._(...)`.
 *
 * Under Babel (Solid-correct): `t` becomes the context `_` helper.
 * Under native transform: `t` becomes `$__i18n._(...)` where `$__i18n` is the
 * Solid accessor, so runtime throws `TypeError: $__i18n._ is not a function`.
 */
export function App() {
  const { t, i18n } = useLingui();

  return (
    <main>
      <h1>{t({ message: 'Hello from Solid', comment: 'Greeting shown on the demo page.' })}</h1>
      <p>
        Active locale (accessor path, should work under both transforms): <code>{i18n().locale}</code>
      </p>
      <p>
        Transform mode: <code>{import.meta.env.LINGUI_TRANSFORM ?? 'unset'}</code>
      </p>
    </main>
  );
}
