const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const userController = require("../controllers/userController.js");
const auth = require("../auth.js")

// routes folder - url endpoints.
// checks if email exists
router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(
		resultFromController => res.send(resultFromController));
})

// registers new user
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(
		resultFromController => res.send(resultFromController));
})

// logins user
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(
		resultFromController => res.send(resultFromController));
})

// s38 Activity - Code Along
// middlewares - functions inbetween our code. auth.verify - example of middleware.

// get user details
router.post("/details", auth.verify, (req, res) => {
	// We can get the token by accessing req.headers.authorization
	const userData = auth.decode(req.headers.authorization)

	userController.getProfile({userId: userData.id}).then(
		resultFromController => res.send(resultFromController));
})

// s41 d1
// user enrollment - enroll a user
router.post("/enroll", auth.verify, (req, res) =>{
	let data = {
		userId: auth.decode(req.headers.authorization).id,
		isAdmin: auth.decode(req.headers.authorization).isAdmin,
		courseId: req.body.courseId

	}
	userController.enroll(data).then(resultFromController => res.send(resultFromController));
})

module.exports = router;