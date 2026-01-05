import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-90
        ${theme === 'dark'
                    ? 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 shadow-md'
                }`}
            title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
        >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
