import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";

export const multerConfig = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "temp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, file.originalname);

        return cb(null, res.toString("hex") + file.originalname);
      });
    },
  }),
};
