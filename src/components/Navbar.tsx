"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Plane, Calendar, Bed, Shield, Car, User, LogOut, MapPin, BookOpen, DollarSign, Cloud } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { smoothScrollTo } from "@/lib/smoothScroll";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus first element when menu opens
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isMobileMenuOpen]);

  // Primary navigation - core booking features
  const primaryNavLinks = [
    { href: "/flights", label: "Flights", icon: Plane },
    { href: "/stays", label: "Stays", icon: Bed },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/transport", label: "Transport", icon: Car },
  ];

  // Secondary navigation - content and tools
  const secondaryNavLinks = [
    { href: "/destinations", label: "Destinations", icon: MapPin },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/currency", label: "Currency", icon: DollarSign },
    { href: "/weather", label: "Weather", icon: Cloud },
    { href: "/safety", label: "Safety", icon: Shield },
  ];

  // All links for mobile menu
  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If already on homepage, scroll to top smoothly
    if (pathname === '/') {
      e.preventDefault();
      smoothScrollTo(0, { duration: 600, offset: 0 });
    }
    // Otherwise, let Next.js Link handle navigation normally
  };

  return (
    <>
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to content
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-background/90"
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background rounded-md p-1"
              aria-label="Diasporan Home"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/diasporan.png"
                  alt="Diasporan Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <span className="text-xl font-semibold text-foreground leading-none">
                Diasporan
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="menubar">
              {primaryNavLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    className={`px-2 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background ${active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* More dropdown for secondary links */}
              <div className="relative group">
                <button className="px-2 py-2 rounded-md transition-colors text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background">
                  More
                </button>
                <div className="absolute top-full right-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {secondaryNavLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          prefetch={true}
                          className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                        >
                          <link.icon className="w-4 h-4" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Toggle & CTA Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <>
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      {user.user_metadata?.first_name || 'User'}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden bg-background border-t border-border"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {/* Theme Toggle for Mobile */}
              <div className="flex justify-center pb-3 border-b border-border mb-3">
                <ThemeToggle />
              </div>

              {allNavLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstFocusableRef : null}
                    href={link.href}
                    prefetch={true}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-background ${active
                      ? "bg-slate-100 border border-slate-200 text-foreground dark:bg-slate-800 dark:border-slate-700"
                      : "hover:bg-muted text-muted-foreground"
                      }`}
                  >
                    <link.icon className={`w-5 h-5 ${active ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-400"}`} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
              <div className="pt-3 space-y-2">
                {user ? (
                  <>
                    <Link href="/profile" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="default" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        {user.user_metadata?.first_name || 'User'} {user.user_metadata?.last_name || ''}
                      </Button>
                    </Link>
                    <Button
                      ref={lastFocusableRef}
                      variant="outline"
                      size="default"
                      className="w-full gap-2"
                      onClick={() => {
                        signOut();
                        closeMobileMenu();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="default" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMobileMenu}>
                      <Button
                        ref={lastFocusableRef}
                        variant="primary"
                        size="default"
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
