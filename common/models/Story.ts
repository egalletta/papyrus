import mongoose from "mongoose";

const uri: string = "mongodb://mongo:27017";

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) {
      console.log(err.message);
      process.exit(1);
    } else {
      console.log("Successfully Connected!");
    }
  }
);

export interface IBasicStory {
  title: string;
  author: string;
  link: string;
  content: string;
}

export interface IStory extends mongoose.Document, IBasicStory {}

export const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  link: { type: String, required: true },
  content: { type: String, required: true },
});

export interface IBasicRandomlySelectedStory extends IBasicStory {
  key: string;
}

export interface IRandomlySelectedStory
  extends IBasicRandomlySelectedStory,
    mongoose.Document {}

export const RandomlySelectedStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  link: { type: String, required: true },
  content: { type: String, required: true },
  key: { type: String, required: true },
});

export const Story = mongoose.model<IStory>("Story", StorySchema);
export const RandomlySelectedStory = mongoose.model<IRandomlySelectedStory>(
  "RandomlySelectedStory",
  RandomlySelectedStorySchema
);
