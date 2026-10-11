"use client";

import React, {
  useState,
  useTransition,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

import { usePathname, useRouter } from "../i18n/navigation";
import { useLocale } from "next-intl";

type Locale = "en" | "et" | "ru" | "uk";

type Props = {
  defaultValue: string;
  label: string;
  children: ReactNode;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: Locale) => {
    setIsOpen(false);

    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <span className="sr-only">{label}</span>

      <button
        type="button"
        disabled={isPending}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex h-12 w-12
          items-center justify-center rounded-full
          border border-gray-300 bg-white
          text-black shadow-md
          transition-colors
          hover:text-[#9551c9]
          focus-visible:outline-2
          focus-visible:outline-offset-2"
      >
        <span className="font-semibold uppercase">
          {locale || defaultValue}
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute -mt-11.5 w-12
            rounded-full border border-gray-300
            bg-white pt-12 shadow-lg"
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement<{ value: Locale }>(child)) {
              return null;
            }

            const value = child.props.value;

            return (
              <li key={value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === value}
                  disabled={isPending}
                  onClick={() => handleSelect(value)}
                  className="w-full rounded-full
                    py-2 text-center text-gray-500
                    transition-colors
                    hover:bg-[#9551c9]/20
                    hover:text-black
                    focus-visible:outline-2"
                >
                  {child}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
