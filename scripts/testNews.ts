import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { writeClient } from "../sanity/lib/client.js"

async function createTestPost() {
  const doc = {
    _type: "post",
    title: "Test News: Automation working",
    slug: {
      _type: "slug",
      current: "test-news-automation",
    },
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "If you see this in Sanity, your automation system works.",
          },
        ],
      },
    ],
  }

  await writeClient.create(doc)
  console.log("Draft article created in Sanity ✅")
}

createTestPost()