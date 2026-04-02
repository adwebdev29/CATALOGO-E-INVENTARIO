"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase/supabase";
import { crearUsuarioDesdeAdmin } from "@/app/_actions/usuarios";

export default function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "admin",
  });

  // ✅ fetch normal
  async function fetchUsuarios() {
    try {
      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .order("nombre");

      if (error) {
        console.error("Error al traer usuarios:", error);
        return;
      }

      setUsuarios(data || []);
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  }

  // ✅ FIX: evitar ejecución síncrona directa
  useEffect(() => {
    async function loadUsuarios() {
      await fetchUsuarios();
    }

    loadUsuarios();
  }, []);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await crearUsuarioDesdeAdmin(nuevoUsuario);

      if (res.error) {
        alert("Error al crear usuario: " + res.error);
      } else {
        alert("✅ ¡Usuario creado con éxito!");

        setNuevoUsuario({
          nombre: "",
          email: "",
          password: "",
          rol: "admin",
        });

        await fetchUsuarios(); // refrescar tabla
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
    }

    setCargando(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold mb-6 text-emerald-900 border-b border-emerald-100 pb-3">
          👤 Registrar Nuevo Usuario
        </h2>

        <form
          onSubmit={handleCrearUsuario}
          className="flex flex-col gap-4 text-sm"
        >
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@woox.com"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Contraseña Temporal
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-600 text-xs uppercase tracking-wider">
              Nivel de Acceso (Rol)
            </label>
            <select
              value={nuevoUsuario.rol}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
              }
              className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all bg-white"
            >
              <option value="admin">Administrador (Control Total)</option>
              <option value="editor">Editor (Solo lectura/edición)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-700/20 disabled:bg-emerald-400"
          >
            {cargando ? "Registrando..." : "Crear Usuario"}
          </button>
        </form>
      </div>

      {/* TABLA RESPONSIVA */}
      <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[400px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  Nombre del Usuario
                </th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                  Rol Asignado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-800 text-sm">
                    {u.nombre}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wide ${
                        u.rol === "admin"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan="2"
                    className="p-8 text-center text-slate-400 font-medium"
                  >
                    No hay usuarios registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
