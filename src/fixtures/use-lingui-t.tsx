import { useLingui } from '@lingui/solid/macro';

/** Fixture used by `npm run show:native-transform` — keep in sync with App.tsx. */
export function Demo() {
  const { t, i18n } = useLingui();
  return (
    <div>
      {t({ message: 'Hello from Solid', comment: 'Greeting shown on the demo page.' })}
      {i18n().locale}
    </div>
  );
}
