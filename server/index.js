import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5174;

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/yelp-ai", async (req, res) => {
  try {
    const { query, user_context, chat_id } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid `query`" });
    }

    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing YELP_API_KEY in .env" });
    }

    // Yelp AI API contract:
    // - New search: { query, user_context: { locale, latitude, longitude } }
    // - Follow-up: { query, chat_id }
    const payload = chat_id
      ? { query, chat_id }
      : { query, user_context };

    const yelpResp = await fetch("https://api.yelp.com/ai/chat/v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await yelpResp.json();

    if (!yelpResp.ok) {
      return res.status(yelpResp.status).json({
        error: "Yelp API error",
        status: yelpResp.status,
        details: data,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
