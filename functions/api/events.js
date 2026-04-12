export async function onRequestGet(context) {
  const { results } = await context.env.DB
    .prepare("SELECT * FROM events ORDER BY id DESC")
    .all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const data = await context.request.json();

  const { name, date, location } = data;

  if (!name || !date) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400
    });
  }

  await context.env.DB.prepare(
    "INSERT INTO events (name, date, location) VALUES (?, ?, ?)"
  )
    .bind(name, date, location)
    .run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
