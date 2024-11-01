import { createContext, useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

type Lang = "en" | "id";

type LocaleProviderProps = {
  children: React.ReactNode;
  defaultLang?: Lang;
  storageKey?: string;
};

type LocaleProviderState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const initialState: LocaleProviderState = {
  lang: "en",
  setLang: () => null,
};

const ThemeProviderContext = createContext<LocaleProviderState>(initialState);

export function LocaleProvider({
  children,
  defaultLang = "en",
  storageKey = "twittor-academy-locale-key",
  ...props
}: LocaleProviderProps) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem(storageKey) as Lang) || (i18n.language as Lang),
  );

  useEffect(() => {
    localStorage.setItem(storageKey, lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const value = {
    lang,
    setLang: (lang: Lang) => {
      localStorage.setItem(storageKey, lang);
      setLang(lang);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useLocale = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("use Locale must be used within the Locale Provider");

  return context;
};
