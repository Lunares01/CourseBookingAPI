const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Course = require("../models/Course.js");

module.exports.checkEmailExists = (reqBody) => {
	return User.find({email: reqBody.email}).then(result => {
		if(result.length > 0) {
			return false;
		} else {
			return true; 
		}
	})
}

module.exports.registerUser = (reqBody) => {
	let newUser = new User ({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		password: bcrypt.hashSync(reqBody.password, 10)
		// 10 = salt  ?
	})

	return newUser.save().then((user,error) => {
		if(error){
			return `User registration failed!`
		} 
		return `User ${reqBody.firstName} has successfuly been created!`
	})
}

module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
		if(result == null){
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			if (isPasswordCorrect) {
				// Generate an Access
				return {access: auth.createAccessToken(result)}
			}
			return "Login Failed. Username or password is incorrect."
		}
	})
}

module.exports.getProfile = (reqBody) => {
	return User.findById(reqBody.userId).then(result =>{
		return result; 
	})
}

module.exports.enroll = async (data) => {
	// Check if user is done adding course to its enrollment array
	if (!data.isAdmin){
		let isUserUpdated = await User.findById(data.userId).then(user => {
			user.enrollments.push({
				courseId: data.courseId
			})
			return user.save().then((user,error) => {
				if(error){
					return false
				}
				return true
			})
		})


		let isCourseUpdated = await Course.findById(data.courseId).then(course => {
			course.enrollees.push({
				userId: data.userId
			})
			return course.save().then((course,error) => {
				if(error){
					return false
				}
				return true
			})
			
		})

		if(isUserUpdated && isCourseUpdated){
			// isUserUpdated = true
			// isCourseUpdated = true
			// final Output = TRUE
			return "Enrollment Successful!"
		}
		// if one of these: isUserUpdated or isCourseUpdated is false
		// Output will be false
		// if both isUserUpdated and isCourseUpdated is false
		// output will be false.
		return false
	} else {
	let message = Promise.resolve("User feature is for Non Admin only.")
	return message
	}
}