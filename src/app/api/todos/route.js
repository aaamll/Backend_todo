import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Define CORS headers properly
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Allow all origins
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight (OPTIONS) request
export async function OPTIONS() {
  return new Response(null, { status: 204, headers });
}


export async function GET(req) {
  const { data, error } = await supabase.from('todos').select('*');
  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200, headers }
  );
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
  }

  // Assuming you are using an array or database
  const index = todos.findIndex(todo => todo.id == id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Todo not found" }), { status: 404 });
  }

  todos.splice(index, 1); // Remove from array

  return new Response(JSON.stringify({ message: "Todo deleted successfully" }), { status: 200 });
}




export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.text) {
      return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
        status: 400, headers
      });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{ text: body.text }])
      .select();

    return new Response(JSON.stringify(error ? { error: error.message } : data), {
      status: error ? 500 : 201, headers
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers
    });
  }
}
