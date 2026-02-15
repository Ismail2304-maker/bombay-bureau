import Parser from "rss-parser";

const parser = new Parser();

const RSS_FEEDS = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", category: "world" },
  { url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml", category: "india" },
  { url: "https://feeds.reuters.com/reuters/businessNews", category: "business" },
  { url: "https://feeds.reuters.com/reuters/technologyNews", category: "technology" },
  { url: "https://feeds.reuters.com/reuters/politicsNews", category: "politics" },
];

export async function getRandomArticleFromRSS() {
  const randomFeed = RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];

  const feed = await parser.parseURL(randomFeed.url);

  if (!feed.items.length) return null;

  const randomItem =
    feed.items[Math.floor(Math.random() * feed.items.length)];

  return {
    title: randomItem.title || "",
    content: randomItem.contentSnippet || randomItem.content || "",
    category: randomFeed.category,
  };
}