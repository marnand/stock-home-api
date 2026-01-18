import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente com service role para operações administrativas
const supabaseServiceRole = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey
);

export const supabaseAdmin = supabaseServiceRole;

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("items").select("count");
    if (error) throw error;
    return { success: true, message: "Conexão com Supabase estabelecida" };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao conectar com Supabase",
      error: String(error),
    };
  }
}
