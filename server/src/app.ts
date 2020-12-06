import express from "express";
import {
  Story,
  RandomlySelectedStory,
  IRandomlySelectedStory,
  IStory,
  IBasicRandomlySelectedStory,
} from "./models/Story";

const app = express();
const PORT = 80;

app.use((req, res, next) => {
  console.log(Date.now() + ": " + req.headers);
  if (req.headers.key === undefined) {
    res.status(400).send("Please specify key in request headers");
  } else {
    next();
  }
});

app.post("/print", (req, res, next) => {
  RandomlySelectedStory.findOneAndDelete(
    { key: <string>req.headers.key },
    (err, story) => {
      if (err) {
        res.status(404).send("Not found.");
      } else if (story === null) {
        res.status(404).send("Not found.");
      } else {
        console.log("Printing story" + JSON.stringify(story.title));
        res.send(story);
      }
    }
  );
});

app.post("/request-to-print", (req, res) => {
  Story.countDocuments({}).exec((err, count) => {
    let rand = Math.floor(Math.random() * count);
    Story.findOne()
      .skip(rand)
      .exec(async (err, stry: IStory) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          let selectedStory: IBasicRandomlySelectedStory = {
            title: stry.title,
            author: stry.author,
            link: stry.link,
            content: stry.content,
            key: <string>req.headers.key,
          };
          let mongoSelectedStory = new RandomlySelectedStory(selectedStory);
          await mongoSelectedStory.save((err: any) => {
            if (err) {
              console.log(err);
              res.status(500).send("Internal Server Error.");
            } else {
              selectedStory.content = "Omitted for brevity.";
              res.send(selectedStory);
            }
          });
        }
      });
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running on port ${PORT}`);
});
