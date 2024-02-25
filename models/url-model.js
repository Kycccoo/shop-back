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
    icon: {
      type: String, // 使用 Buffer 存储二进制数据
    },
<<<<<<< HEAD
    buttonStates: {
      type: Boolean,
    },
=======
>>>>>>> abcd47c2d6847f59ca23dc64b6bebbe9c0dff895
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
