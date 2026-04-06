"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        title: "Error al iniciar sesión: ",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });

      setCargando(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabecera con la marca Woox */}
        <div className="bg-emerald-900 p-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase">
            WOOX
          </h1>
          <p className="text-blue-100 font-medium mt-2 tracking-widest uppercase text-xs">
            Acceso al Sistema
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Usuario / Correo
            </label>
            <input
              type="email"
              placeholder="admin@woox.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-200 p-3 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-all text-t font-medium bg-slate-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-200 p-3 rounded-lg focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-all text-black font-medium bg-slate-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 text-white font-bold text-lg p-3 rounded-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-blue-500/30 mt-4 active:scale-[0.98] disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {cargando ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
