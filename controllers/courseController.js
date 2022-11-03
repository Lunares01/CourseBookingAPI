const Course = require("../models/Course.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");

module.exports.addCourse = (data) => {
	if (data.isAdmin) {
		let newCourse = new Course({
			name: data.course.name,
			description: data.course.description,
			price: data.course.price
		})

		return newCourse.save().then((newCourse, error) => {
			if(error) {
				return `Course cannot be added. Something went wrong.`
			}
			return `Course ${data.course.name} has been successfully created.`
		})
	}

	let message = Promise.resolve("User must be ADMIN to access this.")

	return message.then((value) => {
		return value
	})
}

module.exports.getAllCourses = () => {
	return Course.find({}).then(result => {
		return result
	})
}

module.exports.getActiveCourses = (courseId) => {
	return Course.find({isActive: true}).then(result => {
		return result
	})
}

// get single course
module.exports.getCourse = (courseId) => {
	return Course.findById(courseId).then(result => {
		return result
	})
}

module.exports.updateCourse = (courseId, newData) => {
	return Course.findByIdAndUpdate(courseId, {
		name: newData.name,
		description: newData.description,
		price: newData.price
	}).then((updatedCourse, error) => {
		if(error) {
			return `Something went wrong. Update failed.`
		}
		return `${newData.name} has been successfully updated.`
	})
}

module.exports.archiveCourse = (courseId) => {
	return Course.findByIdAndUpdate(courseId, {
		isActive: false
	})
	.then((archivedCourse, error) => {
		if(error){
			return false
		}
		return true
	})
}