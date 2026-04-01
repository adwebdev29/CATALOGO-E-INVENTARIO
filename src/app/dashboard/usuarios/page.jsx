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
        alert("¡Usuario creado con éxito!");

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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          👤 Registrar Nuevo Usuario
        </h2>

        <form onSubmit={handleCrearUsuario} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nuevoUsuario.nombre}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
            }
            className="border p-2.5 rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={nuevoUsuario.email}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
            }
            className="border p-2.5 rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
            }
            className="border p-2.5 rounded-lg"
            required
          />

          <select
            value={nuevoUsuario.rol}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
            }
            className="border p-2.5 rounded-lg"
          >
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
          </select>

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {cargando ? "Registrando..." : "Crear Usuario"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-slate-600">ID</th>
                <th className="p-4 text-slate-600">Nombre</th>
                <th className="p-4 text-slate-600 text-center">Rol</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4 text-xs text-slate-400 font-mono">
                    {u.id.substring(0, 8)}...
                  </td>

                  <td className="p-4 font-medium text-slate-800">{u.nombre}</td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.rol === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-slate-400">
                    No hay usuarios registrados
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
