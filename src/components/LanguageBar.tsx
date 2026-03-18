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
                    className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] sm:w-auto sm:min-w-[400px] max-w-lg px-2 sm:px-0"
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-full py-3.5 px-5 sm:px-8 shadow-2xl flex items-center justify-between text-white ring-1 ring-white/10">
                        <div className="flex items-center gap-6 sm:gap-10">
                            <button
                                onClick={() => setLanguage('en')}
                                className="relative group py-1.5 outline-none"
                            >
                                <span className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${language === 'en' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    English
                                </span>
                                {language === 'en' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                                    />
                                )}
                            </button>

                            <button
                                onClick={() => setLanguage('ko')}
                                className="relative group py-1.5 outline-none"
                            >
                                <span className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${language === 'ko' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    한국어
                                </span>
                                {language === 'ko' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                                    />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-5 border-l border-white/10 pl-4 sm:pl-6 ml-2 sm:ml-4">
                            <button className="p-1.5 hover:text-sky-400 transition-colors opacity-80 hover:opacity-100">
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1.5 hover:text-red-400 transition-colors opacity-80 hover:opacity-100"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LanguageBar;
