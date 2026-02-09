// Using JSONBlob.com for free JSON storage (no API key needed)
const BLOB_ID = "019bd5c6-4c88-79e6-abe0-a4c49166a20b";
const JSONBLOB_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export default async (req, context) => {
  if (req.method === "POST") {
    try {
      const data = await req.json();

      const response = await fetch(JSONBLOB_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return new Response(JSON.stringify({ success: true, message: "Saved!" }), {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        const error = await response.text();
        return new Response(JSON.stringify({ success: false, error }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  if (req.method === "GET") {
    try {
      const response = await fetch(JSONBLOB_URL);

      if (response.ok) {
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(null), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/save"
};
