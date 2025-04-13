export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, aspect, style } = req.body;

  const API_KEY = "sk-b6ab01e1bd34e012bf1708236e6b15be"; // Replace with your real key

  try {
    const apiRes = await fetch("https://platform.pixverse.ai/api/v1/videos/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: aspect,
        visual_style: style
      })
    });

    const text = await apiRes.text();
    try {
      const data = JSON.parse(text);
      if (apiRes.ok && data.video_url) {
        return res.status(200).json({ video_url: data.video_url });
      } else {
        return res.status(400).json({ error: data.message || "PixVerse error" });
      }
    } catch {
      return res.status(500).json({ error: "Invalid JSON", raw: text });
    }

  } catch (err) {
    return res.status(500).json({ error: "Internal error", detail: err.message });
  }
}
