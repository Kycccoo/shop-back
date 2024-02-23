import url from "../models/url-model.js";
import { StatusCodes } from "http-status-codes";
import validator from "validator";

export const create = async (req, res) => {
  try {
    // req.body.image = req.file.path;
    const result = await url.create({
      title: req.body.title,
      user: req.user._id,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const key = Object.keys(error.errors)[0];
      const message = error.errors[key].message;
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "未知錯誤",
      });
    }
  }
};

export const getMy = async (req, res) => {
  try {
    const result = await url.find({ user: req.user._id });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};

export const addUrl = async (req, res) => {
  try {
    const result = await url.findById(req.params.id);
    result.urls.push(req.body);
    await result.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};

export const edit = async (req, res) => {
  try {
    console.log(req.params.id);
    if (!validator.isMongoId(req.params.id)) throw new Error("ID");
    const result = await url
      .findById(req.params.id)
      .orFail(new Error("NOT FOUND"));
    const idx = result.urls.findIndex(
      (u) => u._id.toString() === req.params.uid
    );
    result.urls[idx].title = req.body.title;
    result.urls[idx].url = req.body.url;
    result.urls[idx].description = req.body.description;
    await result.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError" || error.message === "ID") {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID 格式錯誤",
      });
    } else if (error.message === "NOT FOUND") {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "查無書籤",
      });
    } else if (error.name === "ValidationError") {
      const key = Object.keys(error.errors)[0];
      const message = error.errors[key].message;
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "未知錯誤",
      });
    }
  }
};
