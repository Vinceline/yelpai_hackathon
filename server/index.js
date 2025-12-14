import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5174;

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.YELP_API_KEY),
  });
});

app.post("/api/yelp-ai", async (req, res) => {
  try {
    const { query, user_context, chat_id } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid `query`" });
    }

    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing YELP_API_KEY in .env (server isn’t reading env vars)",
      });
    }

    // Yelp AI API contract:
    // New search requires user_context; follow-ups use chat_id.
    const payload = chat_id
      ? { query, chat_id }
      : { query, user_context };

    if (!chat_id) {
      // enforce user_context for new searches
      if (
        !payload.user_context ||
        typeof payload.user_context.latitude !== "number" ||
        typeof payload.user_context.longitude !== "number"
      ) {
        return res.status(400).json({
          error: "Missing user_context.latitude/longitude for new search",
          got: payload.user_context || null,
        });
      }
    }

    const yelpResp = await fetch("https://api.yelp.com/ai/chat/v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await yelpResp.text(); // read as text first
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    if (!yelpResp.ok) {
      console.error("Yelp API error:", yelpResp.status, data);
      return res.status(yelpResp.status).json({
        error: "Yelp API error",
        status: yelpResp.status,
        details: data,
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Server error",
      details: String(err),
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
