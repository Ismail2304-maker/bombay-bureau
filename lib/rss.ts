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
  { url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "politics" },

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

      if (!feed.items || feed.items.length === 0) continue;

      const randomItem =
        feed.items[Math.floor(Math.random() * feed.items.length)];

      if (!randomItem.title) continue;

      return {
        title: randomItem.title.trim(),
        content:
          randomItem.contentSnippet ||
          randomItem.content ||
          "",
        category: feedConfig.category,
      };
    } catch (error) {
      console.error("RSS failed:", feedConfig.url);
      continue;
    }
  }

  return null;
}