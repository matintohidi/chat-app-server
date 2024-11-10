const usersController = require("../controllers/usersController");
const authMiddlewares = require("../middlewares/authMiddlewares");
const multer = require("multer");

const router = require("express").Router();

router.post("/" , authMiddlewares.checkUser);
router.post("/register" , usersController.register);
router.post("/login" , usersController.login);
router.put("/setprofile" , usersController.uploadUserProfile , usersController.resizeUserPhoto , usersController.setProfile);
router.put("/change-profile" , usersController.uploadUserProfile , usersController.resizeChangeUserPhoto , usersController.changeProfile);
router.put("/change-user-info" , authMiddlewares.changeUserInfo);
router.put("/change-password" , authMiddlewares.changePassword);

module.exports = router;