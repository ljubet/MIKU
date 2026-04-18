"use client"
import { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations } from './translations'

type LanguageContextType = {
  lang: Language
  setLang: (l: Language) => void
  t: (key: keyof typeof translations['mk']) => string
}

const LanguageContext = createContext<LanguageContextType>(null!)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('mk')
  const t = (key: keyof typeof translations['mk']) => translations[lang][key] ?? translations['mk'][key]
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
}

export const useLang = () => useContext(LanguageContext)
