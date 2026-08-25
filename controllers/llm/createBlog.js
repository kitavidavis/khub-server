const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY']
});

function isNonEmptyString(value, maxLength) {
    return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

async function createBlog(req, res) {
    try{
        const { title, description, tags } = req.body;

        // Previously unvalidated: a missing/non-array `tags` would throw on
        // .join(), and there was no bound on prompt size - both a crash risk and an
        // easy way to run up the (metered) Anthropic bill with oversized requests.
        if(!isNonEmptyString(title, 200) || !isNonEmptyString(description, 2000)){
            return res.status(400).json({ message: "title and description are required (title <= 200 chars, description <= 2000 chars)." });
        }

        const safeTags = Array.isArray(tags)
            ? tags.filter((tag) => typeof tag === "string").slice(0, 10).map((tag) => tag.slice(0, 40))
            : [];

        const prompt = `Write a detailed blog post titled "${title}" about "${description}" with the following tags: ${safeTags.join(", ")}. Return in HTML format`;

        const completion = await client.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 800,
          temperature: 0.7,
          system: "You are a helpful blog writing assistant.",
          messages: [{ role: "user", content: prompt }],
        });

        return res.status(200).send({ data: completion.content });
    } catch(error){
      console.error(error);
      return res.status(500).json({ message: "Failed to generate content." });
    }
}

module.exports = createBlog;
