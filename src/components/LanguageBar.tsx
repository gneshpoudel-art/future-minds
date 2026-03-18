import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const LanguageBar = () => {
    const { language, setLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);

    // Auto-hide bar after some scroll? Or just keep it fixed as per image choice.
    // The user's image shows it as a floating bar.

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
                >
                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full py-3 px-6 shadow-2xl flex items-center justify-between text-white">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setLanguage('en')}
                                className="relative group py-1"
                            >
                                <span className={`text-sm font-semibold transition-colors ${language === 'en' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    English
                                </span>
                                {language === 'en' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
                                    />
                                )}
                            </button>

                            <button
                                onClick={() => setLanguage('ko')}
                                className="relative group py-1"
                            >
                                <span className={`text-sm font-semibold transition-colors ${language === 'ko' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    한국어
                                </span>
                                {language === 'ko' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full"
                                    />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                            <button className="p-1 hover:text-indigo-400 transition-colors">
                                <Menu className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1 hover:text-red-400 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LanguageBar;
