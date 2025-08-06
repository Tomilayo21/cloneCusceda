// components/LanguageSelector.js
"use client";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function LanguageSelector() {
  const { user } = useUser();
  const { t } = useTranslation();

  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang); // change i18next language

    if (user) {
      await user.update({
        publicMetadata: {
          preferredLanguage: lang,
        },
      });
    }

    localStorage.setItem("lang", lang); // optional
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}
