import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
});

const RSS_FEEDS = [
  // 🌍 WORLD
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "world" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", category: "world" },

  // 🇮🇳 INDIA
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "india" },
  { url: "https://indianexpress.com/section/india/feed/", category: "india" },

  // 🏛 POLITICS
  { url: "https://indianexpress.com/section/political-pulse/feed/", category: "politics" },

  // 💼 BUSINESS
  { url: "https://www.thehindu.com/business/feeder/default.rss", category: "business" },
  { url: "https://www.business-standard.com/rss/home_page_top_stories.rss", category: "business" },

  // 💻 TECHNOLOGY
  { url: "https://www.thehindu.com/sci-tech/technology/feeder/default.rss", category: "technology" },
  { url: "https://feeds.feedburner.com/gadgets360-latest", category: "technology" },
];

export async function getRandomArticleFromRSS() {
  for (const feedConfig of RSS_FEEDS) {
    try {
      console.log("Trying RSS:", feedConfig.url);

      const feed = await parser.parseURL(feedConfig.url);

      if (!feed?.items?.length) continue;

    const validItems = feed.items.filter((item) => {
  return (
    typeof item.title === "string" &&
    item.title.length > 15 &&
    !item.title.toLowerCase().includes("live updates")
  );
});

if (validItems.length === 0) continue;

const randomItem =
  validItems[Math.floor(Math.random() * validItems.length)];

return {
  title: randomItem.title!.trim(),
  content: randomItem.contentSnippet ?? "",
  category: feedConfig.category,
};
    } catch (error) {
      console.error("RSS failed:", feedConfig.url);
      continue; // Skip broken feed safely
    }
  }

  return null;
}