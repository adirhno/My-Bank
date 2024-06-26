const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const passwordValidator = require("password-validator");
const passwordValidatorSchema = new passwordValidator();

class AuthController {
	async register(req, res) {
		passwordValidatorSchema.has().not().spaces().is().min(8);

		let userDetails = req.body;
		const token = jwt.sign({ user: userDetails.email }, process.env.TOKEN, {
			expiresIn: "2h",
		});
		const refreshToken = jwt.sign(
			{ user: userDetails.email },
			process.env.REFRESH_TOKEN
		);

		try {
			if (!validator.isEmail(userDetails.email)) throw "invalid email!"
			if (!passwordValidatorSchema.validate(userDetails.password))throw "the password should be minimum of 8 characters!";
			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
			const hashedPassword = bcrypt.hashSync(userDetails.password, salt);
			userDetails["password"] = hashedPassword;
			const user = await User.find({ email: userDetails.email });
			if (user.length > 0) {
				if (userDetails.withGoogle) {
					res.cookie("token", token, {
						httpOnly: true,
						path: "/",
						sameSite: "none",
						secure: true,
						maxAge: 900000,
					}).cookie("refresh", refreshToken, {
						httpOnly: true,
						path: "/",
						sameSite: "none",
						secure: true,
						maxAge: 900000,
					});

					res.sendStatus(200);
				} else {
					throw "email already exist!";
				}
			} else {
					userDetails["transactions"] = [];
					userDetails["balance"] = 0;
					let u1 = new User(userDetails);
					u1.save();

					res.cookie("token", token, {
						httpOnly: true,
						sameSite: "none",
						path: "/",
						secure: true,
						maxAge: 900000,
					}).cookie("refresh", refreshToken, {
						httpOnly: true,
						sameSite: "none",
						path: "/",
						secure: true,
						maxAge: 900000,
					});

					res.json({ userDetails });
			
			}
		} catch (error) {
			res.status(400).send(error);
		}
	}

	async signIn(req, res) {
		try {
			const user = await User.find({ email: req.body.email });
			if (user.length == 0) {
				throw "user not found!";
			}
			const passwordVerified = bcrypt.compareSync(
				req.body.password,
				user[0].password
			);
			if (!passwordVerified) {
				res.sendStatus(401);
			}
			if (passwordVerified && !req.body.withGoogle) {
				const token = jwt.sign(
					{ user: req.body.email },
					process.env.TOKEN,
					{ expiresIn: "1h" }
				);
				const refreshToken = jwt.sign(
					{ user: req.body.email },
					process.env.REFRESH_TOKEN
				);
				user["token"] = token;

				res.cookie("token", token, {
					httpOnly: true,
					sameSite: "none",
					path: "/",
					secure: true,
					maxAge: 900000,
				})
					.cookie("refresh", refreshToken, {
						httpOnly: true,
						sameSite: "none",
						path: "/",
						secure: true,
						maxAge: 900000,
					})
					.cookie("user", req.body.email, {
						httpOnly: true,
						sameSite: "none",
						path: "/",
						secure: true,
						maxAge: 900000,
					});

				res.json({ refreshToken, user });
			}
		} catch (error) {
			res.sendStatus(400);
		}
	}

	async homePage(req, res) {
		try {
			const user = await User.findOne({
				email: `${req.params.userEmail}`,
			})
				.select("transactions")
				.populate("transactions");

			res.json(user.transactions);
		} catch (error) {
			res.send({ msg: "error while trying to get the transactions" });
			console.log(error);
		}
	}

	// async verification(req, res) {
	// 	console.log(req.body)
	// 	console.log(twilioMessagesManager)
	// 	const { token } = req.body
	// 	try{
	// 		twilioMessagesManager.sendSMS("972547443231", token)
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	async signOut(req, res) {
		res.clearCookie("token").clearCookie("refresh").send("token cleared!");
	}
}

const authController = new AuthController();
module.exports = authController;
