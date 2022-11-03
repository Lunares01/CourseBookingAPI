const jwt = require("jsonwebtoken"); 
const secretCode = "CourseBookingAPI";

// to create a token using jwt for authorization.
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}


	return jwt.sign(data, secretCode, {});
};

// To verify a token from the request/from postman.
module.exports.verify = (request, response, next) => {
	let token = request.headers.authorization // stores authorization token from postman.

	if(typeof token !== "undefined"){
		console.log(token)
		// Bearer <actual-token> - bearer = 7 length
		token = token.slice(7, token.length)
		// <actual-token>

		// To verify the token using jwt, it requires the actual  token and the secret key that was used to create it. (secret = secretCode)
		return jwt.verify(token, secretCode, (error, data) => {
			if(error){
				return response.send({
					auth: "Failed"
				})
			} else {
				next()
			}
		})
	} else {
		return null
	}
}

// To decode the user details from the token.
module.exports.decode = (token) => {
	if(typeof token !== "undefined") {
		token = token.slice(7, token.length)

		return jwt.verify(token, secretCode, (error, data) => {
			if(error) {
				return null
			} else {
				return jwt.decode(token, {complete: true}).payload
			}
		})
	} else {
		return null
	}
}