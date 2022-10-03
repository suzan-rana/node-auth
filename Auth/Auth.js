const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//for jwt
const SECRET_KEY = 'ae897635ca091a275aeeba4f322a4f4e21bdfe97e81afde5d169b89f3ac3f83bbceff7'

//require("crypto").randomBytes(35).toString("hex")

//authentication: username, password, id, role[admin, basic]
// -----register a user, hashing a password , bcrypt.hash(password, 10)
// -----login a user, and hashing a pssword bcrypt.compare(password, user.pass)
// ----- change a user role, ==> update User Role,
// ----- delete a user

// we generate a token using jwt.sign({id, username, role} ie payload, secret_key, expiresIn) and set a cookie of client using: res.cookie('jwt', token, {options})



exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if( password.length <  6) {
        return res.status(400).json({
            message: "Password is leass than 6 characters."
        })
    }
    
    try {

        bcrypt.hash(password, 10).then(async (hashedPassword) => {
            await User.create({
                username,
                password: hashedPassword
            })
            .then( user => {
                const maxAge = 3 * 50 * 50;
                const token = jwt.sign({
                    id: user._id,
                    username, 
                    role: user.role
                }, SECRET_KEY,
                {
                    expiresIn: maxAge, //3hrs in sec.
                })
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000, // 3hrs in ms
                })
                res.status(200).json({
                    message: "User created successfully",
                    user: user._id,
                })
            }).catch( error => {
                res.status(400).json({
                    message: "Some error occured.",
                    error: error.message,
                })
            })
        })
        
    } catch(error) {
        res.status(401).json({
            message: "User not created.",
            error: error.message,
        })
    }
}


//login 
/*
exports.login = async (req, res, next ) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({
            message: "Username and pass not found."
        })
    } 
    try{
        const user = await User.findOne({ username })
        if( !user ) {
            return res.status(401).json({
                message: "Login not succsful.",
                error: "Usr not found."

            })
        } else {
            //comparing passwords.
            await bcrypt.compare(password, user.password).then( response => {
                if( response ) {
                    res.status(200).json({
                        message: "Login successfull.",
                    })
                } else {
                    res.status(400).json({
                        message: "Incorrect password",
                    })
                }
            })
        }
    } catch( error ) {
        res.status(400).json( {
            message: "Some error occured.",
            error: error.message,
        })
    }
}
*/

//login with just async await
exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    if( username && password ) {
        
        try{
            const user = await User.findOne({username})
            // check if user exists
            if( !user ) {
                res.status(400).json({
                    message: "Sorry no user found."
                })
            }
            const response = await bcrypt.compare(password, user.password)
            if( !response) {
                res.status(400).json({
                    message: "Sorry wrong password",
                })
            }
            const maxAge = 3 * 50 * 50;
            const token = jwt.sign({
                id: user._id,
                username,
                role: user.role,
            }, SECRET_KEY, {
                expiresIn: maxAge,
            })
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
            } )
            res.status(200).json({
                message: "Logged in successfully.",
                user: user._id,
            })
        } catch( error) {
            res.status(200).json({
                message: "Some error occured."
            }) 
        }
        
        
    } else {
        res.status(400).json({
            message: "Pleae enter username and password."
        })
    }
}
/*
exports.updateRole = async (req, res, next) => {
    const { role, id } = req.body;
    //verifying if role and id is present
    if( role && id ) {
        if( role === "admin") {
            //if entered role is admin
            await User.findById(id)
            .then( user => {
                // if user's role is already admin or not.
                if( user.role !== "admin") {
                    //if role is not admin then promote it to admin
                    user.role = role;
                    user.save( err => {
                        //check for any errors while saving it todb.
                        if( err ) {
                            res.status(400).json({
                                message: "An error occured.",
                                error: err.message
                            })
                            process.exit(1)
                        }
                        res.status('201').json({
                            message: "update successfull."
                        })
                    })
                } else {
                    res.status(400).json({
                        message: "User is alrady admin."
                    });
                }
            }).catch( error => {
                res.status(400).json({
                    message: "An error occured.",
                    error: error.message
                });
            })
            
        } else {
            res.status(400).json({
                message: "Roleis not admin."
            })
        }
    } else {
        res.status(400).json({ 
            message: "Role or id not presnt."
        })
    }
} */

exports.updateRole = async (req, res, next) => {
    const { role, id } = req.body;
    if( role && id ) {
        if( role === "admin") {

            try{
                const user = await User.findById(id);
                if( user.role === 'admin') {
                    res.status(401).json({
                        message: "User is already admin."
                    })
                } else {
                    user.role = role;
                    const response = await user.save( (error) => {
                        res.status(400).json({
                            message: "Some error occured in line: 121.",
                            error: error.message
                        })
                    });
                    // console.log(response)
                    res.status(200).json({
                        message: "Updated to admin successfully"
                    })
                }

            } catch( error ) {
                res.status(400).json({
                    message: "Some error occured.",
                    error: error.message
                })
            }
            
        }
    } else {
        res.status(400).json({
            message: "Please enter your role and Id."
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body;
    await User.findById(id)
    .then( user => {
        user.remove()
    })
    .then( user => {
        res.status(201).json({
            message: "user successfully removed."
        })
    }).catch( error => {
        res.status(400).json({
            message: "an error occured.",
            error: error.message
        })
    })
}