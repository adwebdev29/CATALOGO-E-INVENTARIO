"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";

export default function Configuracion() {
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserEmail(session.user.email);
    });
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase.auth.updateUser({
      password: nuevaPassword,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Tu contraseña ha sido actualizada con éxito.");
      setNuevaPassword("");
    }
    setCargando(false);
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* TARJETA DE INFO */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Mi Cuenta</h2>
        <p className="text-slate-500 mb-6">
          Información general de tu sesión actual.
        </p>

        <div className="bg-slate-50 p-4 rounded-lg border flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Correo Electrónico (Login)
          </span>
          <span className="text-lg font-medium text-slate-800">
            {userEmail || "Cargando..."}
          </span>
        </div>
      </div>

      {/* TARJETA DE SEGURIDAD */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Seguridad</h2>
        <p className="text-slate-500 mb-6">
          Actualiza tu contraseña de acceso al panel WOOX. Te recomendamos usar
          una combinación segura.
        </p>

        <form
          onSubmit={handleUpdatePassword}
          className="flex flex-col sm:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full text-sm">
            <label className="block text-slate-500 font-bold mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full sm:w-auto bg-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 transition disabled:bg-slate-400"
          >
            {cargando ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
