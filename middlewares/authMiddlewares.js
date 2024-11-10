const { User } = require("../models");
const jwt = require("jsonwebtoken");
const brcypt = require("bcrypt");

module.exports.checkUser = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (token) {
            jwt.verify(token , process.env.TOKEN_KEY , async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({
                        status: "un success",
                        message: "Unauthorized",
                    })
                } else {
                    let user = await User.findById(decodedToken.id);

                    user = user.toObject();

                    delete user.password;

                    if (user)
                        return res.status(200).json({
                            user,
                            status: "success",
                        })
                    else
                        return res.status(404).json({
                            status: "un success",
                            message: "User is not defined",
                        })
                }
            })
        } else {
            return res.status(401).json({
                status: "un success",
                message: "Unauthorized",
            })
        }
    } catch (err) {
        next(err);
    }

}

module.exports.changeUserInfo = async (req , res , next) => {
    try {
        const { name , phone , city } = req.body;
        const token = req.headers["authorization"];

        if(token) {
            jwt.verify(token , process.env.TOKEN_KEY , async (err , decodedToken) => {
                if(err) {
                    return res.status(401).json({
                        status: "un success",
                        message: "Unauthorized"
                    })
                } else {
                    let user = await User.findByIdAndUpdate(decodedToken.id , { name , phone , city});

                    user = user.toObject();

                    delete user.password;

                    return res.status(200).json({
                        user,
                        status: "success",
                        message: "Update user info successfully!"
                    })
                }
            })
        } else {
            return res.status(401).json({
                status: "un success",
                message: "Unauthorized"
            })
        }
    } catch (err) {
        next(err);
    }
}

module.exports.changePassword = async (req , res , next) => {
    try {
        const { oldPassword , newPassword } = req.body;
        const token = req.headers["authorization"];

        if(token) {
            jwt.verify(token , process.env.TOKEN_KEY , async (err, decodedToken) => {
                if(err) {
                    return res.status(401).json({
                        status: "un success",
                        message: "Unauthorized"
                    })
                } else {
                    let user = await User.findOne({ _id: decodedToken.id });
                    const isPasswordValid = await brcypt.compare(oldPassword , user.password);

                    if(isPasswordValid) {
                        const hashPassword = await brcypt.hash(newPassword , 10);

                        user = await User.findByIdAndUpdate(decodedToken.id , { password: hashPassword });

                        user = user.toObject();

                        delete user.password;

                        return res.status(200).json({
                            staus: "success",
                            message: "Change password successfully!"
                        })
                    } else {
                        return res.status(401).json({
                            status: "un success",
                            message: "Your password is not correct!"
                        })
                    }

                }
            })
        } else {
            return res.status(401).json({
                status: "un success",
                message: "Unauthorized"
            })
        }
    } catch (err) {
        next(err);
    }
}