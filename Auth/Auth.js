const User = require('../models/User')
const bcrypt = require('bcryptjs')

//authentication: username, password, id, role[admin, basic]
// -----register a user,
// -----login a user,
// ----- change a user role, ==> update User Role,
// ----- delete a user



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
                res.status(200).json({
                    message: "User created successfully",
                    user,
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
            res.status(200).json({
                message: "Logged in successfully."
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