import { Schema, model, ObjectId } from "mongoose";

const urlSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, "請填入網址"],
    },
    title: {
      type: String,
      required: [true, "請填入書籤名稱"],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const schema = new Schema({
  title: {
    type: String,
  },
  urls: {
    type: [urlSchema],
  },
  user: {
    type: ObjectId,
  },
  visible: {
    type: Boolean,
  },
});

export default model("url", schema);
