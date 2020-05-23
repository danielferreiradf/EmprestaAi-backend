import { PrismaClient } from "@prisma/client";
import { CustomRequest, CustomResponse } from "../interfaces/controllers.types";

export const FileController = {
  // @desc Upload new file
  // @method POST
  // @route /api/files
  // @access Private

  async create(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "File is required" });
      }

      const newFile = await prisma.file.create({
        data: {
          name: req.file.originalname,
          path: req.file.path,
          owner: { connect: { id: req.userId } },
        },
      });

      return res.json({ success: true, data: newFile });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
