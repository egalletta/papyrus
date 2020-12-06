import puppeteer, { Page } from "puppeteer";
import { IBasicStory, Story } from "./models/Story";

const scrapeStoryList = async (
  link: string,
  page: puppeteer.Page
): Promise<string[]> => {
  await page.goto(link);
  await page.waitForTimeout(1000);
  await autoScroll(page);
  const result = await page.evaluate(() => {
    let stories: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
      '[title*="Read the"]'
    );
    let links: string[] = [];
    stories.forEach((story) => {
      links.push(story.href);
    });
    return links;
  });
  return result;
};

const scrapeStory = async (
  link: string,
  page: puppeteer.Page
): Promise<IBasicStory> => {
  await page.goto(link);
  const result = await page.evaluate(() => {
    let storyTitle = <string>document.querySelector(".pb-3")!.innerHTML;
    let storyContent = document.getElementsByClassName("content")[0].innerHTML;
    let storyAuthor = <string>(
      document.querySelector(
        "div.titre:nth-child(1) > a:nth-child(1) > h2:nth-child(2)"
      )!.innerHTML
    );
    let link = window.location.href;
    console.log(storyTitle);
    return {
      title: storyTitle,
      author: storyAuthor,
      link: link,
      content: storyContent,
    };
  });
  return result;
};

const getStoriesFromPage = async (page: puppeteer.Page, pageNumber: number) => {
  let links: string[] = await scrapeStoryList(
    `https://short-edition.com/en/category/short-fiction?page=${pageNumber}`,
    page
  );
  console.log("Number of stories found: " + links.length);
  await asyncForEach(links, async (link: string, i: number, arr: string[]) => {
    try {
      console.log("attempting to fetch story " + i + ": " + link);
      let result = await scrapeStory(link, page);
      let story = new Story(result);
      Story.countDocuments({ title: story.title, author: story.author }).exec(
        (err, count) => {
          if (err) {
            console.log(err);
          } else {
            if (count <= 0) {
              story.save((err: any) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Saved story: " + story.title);
                }
              });
            } else {
              console.log(
                "Skipped duplicate story: " +
                  story.title +
                  ", there were " +
                  count +
                  "instances of this story already"
              );
            }
          }
        }
      );
      return story;
    } catch (e) {
      console.log("Whoops error, sorry about that: " + e);
    }
  });
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  for (let i = 1; i <= 13; i++) {
    await getStoriesFromPage(page, i);
  }
  page.close();
  browser.close();
})().then(() => {
  console.log("Completed Successfully.");
  process.exit(0);
});

const asyncForEach = async (array: any[], callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const autoScroll = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve("Complete");
        }
      }, 60);
    });
  });
};

function getElementByXpath(path: string) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
