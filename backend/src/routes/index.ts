import { Router } from "express";
import authRoute from "./auth.routes";
import { upload } from "@/middlewares/multer";
import { deleteFromS3, uploadFileToS3 } from "@/services/s3.service";
import { ROLE } from "@/constants";
import User from "@/models/user.model";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoute);

router.post(
  "/profile/upload-profile",
  authenticate([ROLE.USER]),
  upload.single("image"),
  async (req, res) => {
    try {
      const profile = req.file;

      if (!req.user?._id) return;
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) return;
      console.log("usear", user);

      console.log("profile :", profile);
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (user?.profileImage) {
        const oldKey = user.profileImage.split(".amazonaws.com/")[1];
        if (oldKey) {
          await deleteFromS3(oldKey);
        }
      }

      // 2️⃣ Upload new image
      const newUrl = await uploadFileToS3(req.file, "profile");

      //  Update DB with new image
      user.profileImage = newUrl;
      await user.save();

      console.log("new url", newUrl);
      res.json({ url: newUrl });
    } catch (error) {
      console.error(error);
    }
  }
);
export default router;
