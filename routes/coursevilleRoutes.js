const express = require("express");
const coursevilleController = require("../controller/coursevilleController");

const router = express.Router();

router.get("/login", coursevilleController.login);
router.get("/logout", coursevilleController.logout);
router.get("/access_token", coursevilleController.accessToken);

router.get("/get_user_info", coursevilleController.userInfo);
router.get("/get_courses", coursevilleController.getCourses);
router.get("/get_course_assignments/:cv_cid", coursevilleController.getCourseAssignments);

module.exports = router;