"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Terminal,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { api } from "@/lib/api";

const IndustrialLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    {/* Base stark outline */}
    <rect x="4" y="8" width="28" height="20" stroke="#111111" strokeWidth="3" fill="none" />
    {/* Internal division */}
    <rect x="18" y="8" width="14" height="20" fill="#111111" />
    {/* Indicators */}
    <circle cx="11" cy="18" r="3" fill="#111111" />
    <circle cx="25" cy="18" r="3" fill="#FF4500" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const initAuth = async () => {
      const savedUser = localStorage.getItem("sovereign_user");
      const savedToken = localStorage.getItem("sovereign_token");

      if (savedUser && savedToken && savedToken !== "mock-sovereign-token") {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      } else {
        try {
          const res = await api.login("engineer@mrpl.co.in", "mrpl2026");
          localStorage.setItem("sovereign_token", res.access_token);
          localStorage.setItem("sovereign_user", JSON.stringify(res.user));
          setCurrentUser(res.user);
        } catch (e) {
          const defaultUser = {
            email: "engineer@mrpl.co.in",
            full_name: "Er. Rajesh K. Nayak",
            role: "ENGINEER",
            department: "Plant Integrity"
          };
          localStorage.setItem("sovereign_user", JSON.stringify(defaultUser));
          setCurrentUser(defaultUser);
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "AI WORKBENCH", href: "/", icon: Terminal },
    { label: "DELIVERABLES", href: "/deliverables", icon: Sparkles },
    { label: "SECURITY CENTER", href: "/security", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#111111] bg-[#F4F4F2]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center border-2 border-[#111111] bg-[#FFFFFF] text-[#111111] xl:hidden shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] transition-all rounded-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-4 group">
            <IndustrialLogo />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-[#111111] uppercase">Sovereign<span className="font-mono bg-[#111111] text-[#F4F4F2] px-1 ml-0.5">OS</span></span>
                <span className="hidden xs:inline-block border border-[#111111] bg-[#FF4500] px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                  AIR-GAPPED
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#475569] font-mono font-bold uppercase tracking-widest mt-0.5">MRPL Refinery Unit</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-3 ml-8 border-l-2 border-[#111111] pl-8 h-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 font-bold text-xs uppercase tracking-wider transition-all border-2 border-transparent ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-[#F4F4F2] shadow-[2px_2px_0px_0px_rgba(255,69,0,1)]"
                      : "text-[#111111] hover:bg-[#FFFFFF] hover:border-[#111111] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security & Persona */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 border-2 border-[#111111] bg-[#111111] px-3 py-1.5">
            <div className="h-2 w-2 bg-[#FF4500] animate-pulse"></div>
            <span className="font-mono font-bold text-[10px] sm:text-xs text-[#F4F4F2]">0 EXTERNAL LEAKS</span>
          </div>

          <Link 
            href="/login"
            className="flex items-center gap-2 border-2 border-[#111111] bg-[#FFFFFF] px-3 py-1.5 hover:bg-[#F4F4F2] hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] transition-all shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]"
          >
            <UserCheck className="h-4 w-4 text-[#111111] shrink-0" />
            <div className="text-left leading-none hidden xs:block">
              <div className="font-bold text-[#111111] text-[10px] sm:text-[11px] uppercase tracking-wide">
                {currentUser?.full_name?.split(" ")[0] || "OPERATOR"}
              </div>
              <div className="text-[8px] sm:text-[9px] text-[#FF4500] font-mono font-bold">{currentUser?.role || "ENG"}</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t-2 border-[#111111] bg-[#FFFFFF] px-4 py-4 shadow-lg">
          <nav className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 font-bold text-xs uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? "border-[#111111] bg-[#111111] text-[#F4F4F2] shadow-[2px_2px_0px_0px_rgba(255,69,0,1)]"
                      : "border-[#111111] bg-white text-[#111111] hover:bg-[#F4F4F2] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
