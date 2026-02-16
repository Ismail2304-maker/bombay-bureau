import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
});

const RSS_FEEDS = [
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
];

export async function getRandomArticleFromRSS() {
  try {
    const randomFeed =
      RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];

    const feed = await parser.parseURL(randomFeed);

    if (!feed.items || feed.items.length === 0) {
      console.error("RSS has no items");
      return null;
    }

    const validItems = feed.items.filter(
      (item) => item.title && item.title.trim() !== ""
    );

    if (validItems.length === 0) {
      console.error("No valid titles found");
      return null;
    }

    const randomItem =
      validItems[Math.floor(Math.random() * validItems.length)];

    return {
      title: randomItem.title!.trim(),
      content:
        randomItem.contentSnippet ||
        randomItem.content ||
        "",
    };

  } catch (error) {
    console.error("RSS PARSER ERROR:", error);
    return null;
  }
}