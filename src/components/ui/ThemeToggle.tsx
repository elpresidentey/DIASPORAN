'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  className?: string;
}

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: <Sun className="h-4 w-4" />,
    description: 'Light theme',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <Moon className="h-4 w-4" />,
    description: 'Dark theme',
  },
  {
    value: 'system',
    label: 'System',
    icon: <Monitor className="h-4 w-4" />,
    description: 'Use system preference',
  },
];

export const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
  ({ className }, ref) => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Get current theme icon and label
    const currentTheme = themeOptions.find((t) => t.value === theme) || themeOptions[0];
    const currentThemeOption = themeOptions.find((opt) => opt.value === theme);
    const currentIcon = currentThemeOption?.icon || <Monitor className="h-4 w-4" />;

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
      } else if (event.key === 'ArrowDown' && isOpen) {
        event.preventDefault();
        const firstOption = dropdownRef.current?.querySelector(
          '[role="menuitem"]'
        ) as HTMLButtonElement;
        firstOption?.focus();
      }
    };

    const handleOptionKeyDown = (
      event: React.KeyboardEvent,
      themeValue: Theme,
      index: number
    ) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setTheme(themeValue);
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (index + 1) % themeOptions.length;
        const nextOption = dropdownRef.current?.querySelectorAll(
          '[role="menuitem"]'
        )[nextIndex] as HTMLButtonElement;
        nextOption?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = (index - 1 + themeOptions.length) % themeOptions.length;
        const prevOption = dropdownRef.current?.querySelectorAll(
          '[role="menuitem"]'
        )[prevIndex] as HTMLButtonElement;
        prevOption?.focus();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleThemeSelect = (themeValue: Theme) => {
      setTheme(themeValue);
      setIsOpen(false);
      buttonRef.current?.focus();
    };

    return (
      <div ref={ref} className={cn('relative', className)}>
        <motion.button
          ref={buttonRef}
          className="flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-transparent hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-background"
          style={{ minWidth: 44, minHeight: 44 }}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Toggle theme"
          title="Change theme"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-5 h-5 text-purple-400" />
              ) : (
                <Monitor className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-popover p-2 shadow-lg ring-1 ring-border/20 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="theme-menu-button"
              tabIndex={-1}
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                backgroundColor: 'hsl(var(--popover)/0.95)',
              }}
            >
              <div className="py-1">
                {themeOptions.map((option, index) => {
                  const isSelected = theme === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      role="menuitem"
                      type="button"
                      onClick={() => handleThemeSelect(option.value)}
                      onKeyDown={(e) => handleOptionKeyDown(e, option.value, index)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3',
                        'text-left text-sm transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:bg-white/10',
                        isSelected
                          ? 'bg-purple-600/20 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      )}
                      tabIndex={0}
                      aria-current={isSelected ? 'true' : undefined}
                      aria-label={`${option.label} theme${isSelected ? ' (currently selected)' : ''}`}
                      aria-describedby={`theme-desc-${option.value}`}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span
                        className={cn(
                          'flex items-center justify-center',
                          isSelected ? 'text-purple-400' : 'text-gray-400'
                        )}
                        aria-hidden="true"
                      >
                        {option.icon}
                      </span>
                      <span className="flex-1 font-medium">{option.label}</span>
                      <span id={`theme-desc-${option.value}`} className="sr-only">
                        {option.description}
                      </span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-purple-400"
                        >
                          <Check className="h-4 w-4" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';
