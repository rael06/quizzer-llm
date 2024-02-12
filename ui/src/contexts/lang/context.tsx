import assert from "assert";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { enDictionary } from "../../translations/en";
import { frDictionary } from "../../translations/fr";

export enum Lang {
  Fr = "fr",
  En = "en",
}

export type LangContextType = {
  lang: Lang;
  updateLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextType | null>(null);

function Provider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang | null>(null);

  const updateLang = useCallback((lang: string) => {
    const langValidation = z.nativeEnum(Lang).safeParse(lang);
    if (!langValidation.success) {
      return;
    }

    const validatedLang = langValidation.data;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = validatedLang;
    setLang(validatedLang);
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    updateLang(lang ?? Lang.En);
  }, [updateLang]);

  return (
    <>
      {lang && (
        <LangContext.Provider value={{ lang, updateLang }}>
          {children}
        </LangContext.Provider>
      )}
    </>
  );
}

const langDictionary = {
  [Lang.En]: enDictionary,
  [Lang.Fr]: frDictionary,
} as const;

export function useLang() {
  const context = useContext(LangContext);
  assert(context, "useLang must be used within a LangContextProvider");

  return {
    ...context,
    dictionary: langDictionary[context.lang],
  };
}

export const LangContextProvider = memo(Provider);
