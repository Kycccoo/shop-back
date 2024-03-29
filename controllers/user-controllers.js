import users from "../models/user-model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
// import products from "../models/products.js";
import validator from "validator";

export const create = async (req, res) => {
  try {
    await users.create(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const key = Object.keys(error.errors)[0];
      const message = error.errors[key].message;
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
      });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "帳號已註冊",
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "未知錯誤",
      });
    }
  }
};

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7 days",
    });
    req.user.tokens.push(token);
    await req.user.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        url: req.user.urlQuantity,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};

export const logout = async (req, res) => {
  try {
    req.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
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

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token);
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7 days",
    });
    req.user.tokens[idx] = token;
    await req.user.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result: token,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};

export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        url: req.user.urlQuantity,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};

export const editUrl = async (req, res) => {
  try {
    // 檢查商品 id 格式對不對
    if (!validator.isMongoId(req.body.product)) throw new Error("ID");

    // 尋找購物車內有沒有傳入的商品 ID
    const idx = req.user.url.findIndex(
      (item) => item.product.toString() === req.body.product
    );
    if (idx > -1) {
      // 修改購物車內已有的商品數量
      const quantity = req.user.url[idx].quantity + parseInt(req.body.quantity);
      // 檢查數量
      // 小於 0，移除
      // 大於 0，修改
      if (quantity <= 0) {
        req.user.url.splice(idx, 1);
      } else {
        req.user.url[idx].quantity = quantity;
      }
    } else {
      // 檢查商品是否存在或已下架
      const product = await products
        .findById(req.body.product)
        .orFail(new Error("NOT FOUND"));
      if (!product.sell) {
        throw new Error("NOT FOUND");
      } else {
        req.user.url.push({
          product: product._id,
          quantity: req.body.quantity,
        });
      }
    }
    await req.user.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result: req.user.urlQuantity,
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
        message: "查無商品",
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

export const getUrl = async (req, res) => {
  try {
    const result = await users
      .findById(req.user._id, "url")
      .populate("url.product");
    res.status(StatusCodes.OK).json({
      success: true,
      message: "",
      result: result.url,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "未知錯誤",
    });
  }
};
