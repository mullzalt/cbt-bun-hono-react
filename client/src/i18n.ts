import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enNs1 from "./config/locales/en/ns1.json";
import idNs1 from "./config/locales/id/ns1.json";

i18n.use(initReactI18next).init({
  lng: "id",
  fallbackLng: "en",
  defaultNS: "ns1",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      ns1: enNs1,
    },
    id: {
      ns1: idNs1,
    },
  },
});

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: typeof enNs1;
    };
  }
}

export default i18n;
