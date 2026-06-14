import multer from "multer";
import ApiError from "../utils/ApiError.js";
import { LIMITS } from "../config/constants.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only jpeg, jpg, png, webp images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: LIMITS.MAX_FILE_SIZE,
  },
});

export default upload;