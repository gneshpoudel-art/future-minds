import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.studyAbroad': 'Study Abroad',
    'nav.language': 'Language',
    'nav.resources': 'Resources',
    'nav.contact': 'Contact',
    'nav.appointment': 'Get Appointment',
    'hero.tagline': "Nepal's Trusted Educational Partner",
    'hero.title': 'We Inspire. We Guide. We Empower.',
    'hero.description': 'Your journey to world-class education begins here. Future Minds Educational Consultancy is your gateway to top universities across South Korea, UK, and Europe.',
    'hero.cta': 'Get Appointment',
    'hero.explore': 'Explore Study Abroad',
  },
  ko: {
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.services': '서비스',
    'nav.studyAbroad': '해외 유학',
    'nav.language': '언어',
    'nav.resources': '리소스',
    'nav.contact': '문의',
    'nav.appointment': '약속 잡기',
    'hero.tagline': "네팔의 신뢰할 수 있는 교육 파트너",
    'hero.title': '우리는 영감을 줍니다. 우리는 안내합니다. 우리는 권한을 부여합니다.',
    'hero.description': '당신의 세계 수준의 교육 여정이 여기서 시작됩니다. Future Minds 교육 컨설팅은 남한, 영국, 유럽의 최고 대학으로의 관문입니다.',
    'hero.cta': '약속 잡기',
    'hero.explore': '해외 유학 탐색',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update Google Translate
    const triggerGoogleTranslate = () => {
      const element = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (element) {
        element.value = language;
        element.dispatchEvent(new Event('change'));
      }
    };

    // Try multiple times as the widget loads asynchronously
    triggerGoogleTranslate();
    const timer = setInterval(triggerGoogleTranslate, 1000);
    const timeout = setTimeout(() => clearInterval(timer), 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
