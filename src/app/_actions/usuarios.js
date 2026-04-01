"use server";
import { createClient } from "@supabase/supabase-js";

// Instanciamos Supabase con poderes absolutos usando la llave secreta
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function crearUsuarioDesdeAdmin(datos) {
  const { email, password, nombre, rol } = datos;

  // 1. Crear el acceso seguro en la bóveda de Supabase (auth.users)
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-verificado para que puedan entrar de inmediato
  });

  if (error) return { error: error.message };

  // 2. Ligar ese acceso con su perfil en tu tabla pública (perfiles)
  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .insert([{ id: data.user.id, nombre: nombre, rol: rol }]);

  if (perfilError) return { error: perfilError.message };

  return { success: true };
}
