const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router.route('/signup')
.get( userController.renderUser)
.post( wrapAsync(userController.signupUser));


router.route('/login')
.get(userController.loginRenderUser)
.post(saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
);

router.get("/logout", userController.logoutUser);

module.exports = router;
