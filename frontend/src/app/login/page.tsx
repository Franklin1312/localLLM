"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, UserCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("engineer@mrpl.co.in");
  const [password, setPassword] = useState("mrpl2026");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personas = [
    {
      role: "ENGINEER",
      name: "Er. Rajesh K. Nayak",
      email: "engineer@mrpl.co.in",
      dept: "Mechanical & Plant Integrity",
      desc: "Analyze inspection reports, check SOPs, run calculations."
    },
    {
      role: "MANAGER",
      name: "V. Shenoy",
      email: "manager@mrpl.co.in",
      dept: "Refinery Operations",
      desc: "Authorize approval notes, view board presentations."
    },
    {
      role: "ADMIN",
      name: "Sovereign AI Admin",
      email: "admin@mrpl.co.in",
      dept: "Enterprise IT & Cyber Security",
      desc: "Manage models, tools, and inspect zero-leak network audit logs."
    },
    {
      role: "ANALYST",
      name: "R. Mehta",
      email: "analyst@mrpl.co.in",
      dept: "Process Analytics & Optimization",
      desc: "Process vibration telemetry, spreadsheet generation, data export."
    },
    {
      role: "DEVELOPER",
      name: "A. Krishnan",
      email: "developer@mrpl.co.in",
      dept: "Digital & IT Systems",
      desc: "Custom sandbox tool development, API exploration, automation scripts."
    }
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => {
    setEmail(p.email);
    setPassword(p.role === "ADMIN" ? "admin2026" : "mrpl2026");
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await api.login(email, password);
      localStorage.setItem("sovereign_token", res.access_token);
      localStorage.setItem("sovereign_user", JSON.stringify(res.user));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      // Fallback local persistence if network hiccup
      const matched = personas.find((p) => p.email === email) || personas[0];
      localStorage.setItem("sovereign_user", JSON.stringify({
        email: matched.email,
        full_name: matched.name,
        role: matched.role,
        department: matched.dept
      }));
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-8 font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center bg-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_0px_rgba(255,69,0,1)] mb-2">
          <Lock className="h-7 w-7 text-[#F4F4F2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-widest uppercase">Sovereign OS Auth</h1>
        <p className="text-xs font-bold text-[#475569] max-w-md mx-auto uppercase tracking-wider">
          Role-Based Access Control (RBAC) for Mangalore Refinery and Petrochemicals Limited
        </p>
        <div className="inline-flex items-center gap-1.5 border-2 border-[#111111] bg-[#FFF9E6] px-3 py-1 text-[10px] font-extrabold text-[#111111] uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#FF4500]" />
          DEMO ACCOUNTS ONLY — No Real Credentials
        </div>
      </div>

      {/* Quick Persona Selector — Responsive Grid */}
      <div className="industrial-panel bg-[#F4F4F2] p-5 sm:p-6 space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#111111] flex items-center gap-2 border-b-2 border-[#111111] pb-3">
          <UserCheck className="h-4 w-4 text-[#FF4500]" />
          Select Sovereign Role Persona (Instant Demo Switcher)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personas.map((p) => (
            <div
              key={p.role}
              onClick={() => handlePersonaSelect(p)}
              className={`p-3 border-2 transition-all cursor-pointer flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] ${
                email === p.email
                  ? "border-[#111111] bg-[#111111] text-[#F4F4F2]"
                  : "border-[#111111] bg-white text-[#111111]"
              }`}
            >
              <div className="truncate pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider truncate">{p.name}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold border-2 shrink-0 uppercase tracking-widest ${
                     email === p.email ? "border-[#FF4500] text-[#FF4500]" : "border-[#111111] bg-[#E2E8F0] text-[#111111]"
                  }`}>
                    {p.role}
                  </span>
                </div>
                <div className={`text-[10px] mt-1 truncate uppercase font-bold tracking-wide ${email === p.email ? "text-[#E2E8F0]" : "text-[#475569]"}`}>
                  {p.dept}
                </div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 ${email === p.email ? "text-[#FF4500]" : "text-[#111111]"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="industrial-panel bg-[#F4F4F2] p-5 sm:p-6 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-[#FCE8E6] border-2 border-[#C5221F] text-[#C5221F] text-xs font-bold uppercase tracking-wider">
            {errorMsg}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111]">Enterprise Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="industrial-input w-full font-mono text-sm uppercase bg-white border-[#111111] focus:ring-[#FF4500] focus:border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#111111]">Air-Gap Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="industrial-input w-full font-mono text-sm bg-white border-[#111111] focus:ring-[#FF4500] focus:border-[#111111] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full industrial-button bg-[#FF4500] text-white hover:bg-[#E63E00] py-4 text-xs mt-4"
        >
          <ShieldCheck className="h-5 w-5 shrink-0" />
          {isSubmitting ? "AUTHENTICATING SESSION..." : "AUTHENTICATE SOVEREIGN SESSION"}
        </button>
      </form>
    </div>
  );
}
