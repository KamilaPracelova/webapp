var User = require('../models/user'); // Import User Model
var Story = require('../models/story'); // Import Story Model
var Object = require('../models/object'); // Import Object Model
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'harrypotter'; // Create custom secret for use in JWT

module.exports = function (router) {


    // Route to register new users  
    router.post('/users', function (req, res) {
        var user = new User(); // Create new User object
        user.username = req.body.username; // Save username from request to User object
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.name = req.body.name; // Save name from request to User object
        // Check if request is valid and not empty or null
        if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.name === null || req.body.name === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function (err) {
                if (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
                } else {
                    res.json({ success: true, message: 'user created' });
                }
            });
        }
    });

    // Route to check if username chosen on registration page is taken
    router.post('/checkusername', function (req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That username is already taken' }); // If user is returned, then username is taken
                } else {
                    res.json({ success: true, message: 'Valid username' }); // If user is not returned, then username is not taken
                }
            }
        });
    });

    // Route to check if e-mail chosen on registration page is taken    
    router.post('/checkemail', function (req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That e-mail is already taken' }); // If user is returned, then e-mail is taken
                } else {
                    res.json({ success: true, message: 'Valid e-mail' }); // If user is not returned, then e-mail is not taken
                }
            }
        });
    });

    // USER LOGIN ROUTE
    // http://localhost:8080/api/authenticate
    router.post('/authenticate', function (req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password!' });
                    } else {
                        var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // after 24h token will not be longer usable
                        res.json({ success: true, message: 'User authenticated!', token: token });
                    }
                }
                else {
                    res.json({ success: false, message: 'Not password provided!' });
                }
            }
        });
    });

    // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

        // Check if token is valid and not expired  
        if (token) {
            // Function to verify token
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } else {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });

    // Route to get the currently logged in user    
    router.post('/me', function (req, res) {
        res.send(req.decoded); // Return the token acquired from middleware
    });

    // Route to provide the user with a new token to renew session
    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select('username email').exec(function (err, user) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong' });
            } else {
                // Check if username was found in database
                if (!user) {
                    res.json({ success: false, message: 'No user was found' }); // Return error
                } else {
                    var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Give user a new token
                    res.json({ success: true, token: newToken }); // Return newToken in JSON object to controller
                }
            }
        });
    });

    // Route to get the current user's permission level
    router.get('/permission', function (req, res) {
        User.findOne({ username: req.decoded.username }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' }); // Return an error
            } else {
                res.json({ success: true, permission: user.permission }); // Return the user's permission
            }
        });
    });

    // Route to get all users for management page
    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                User.findOne({ username: req.decoded.username }, function (err, mainUser) {
                    if (err) {
                        res.json({ success: false, message: 'Something went wrong.' });
                    } else {
                        // Check if logged in user was found in database
                        if (!mainUser) {
                            res.json({ success: false, message: 'No user found' }); // Return error
                        } else {
                            // Check if user has editing/deleting privileges 
                            if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                                // Check if users were retrieved from database
                                if (!users) {
                                    res.json({ success: false, message: 'Users not found' }); // Return error
                                } else {
                                    res.json({ success: true, users: users, permission: mainUser.permission }); // Return users, along with current user's permission
                                }
                            } else {
                                res.json({ success: false, message: 'Insufficient Permissions' }); // Return access error
                            }
                        }
                    }
                });
            }
        });
    });

    // Route to delete a user
    router.delete('/management/:username', function (req, res) {
        var deletedUser = req.params.username; // Assign the username from request parameters to a variable
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                // Check if current user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if curent user has admin access
                    if (mainUser.permission !== 'admin') {
                        res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                    } else {
                        // Fine the user that needs to be deleted
                        User.findOneAndRemove({ username: deletedUser }, function (err, user) {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                res.json({ success: true }); // Return success status
                            }
                        });
                    }
                }
            }
        });
    });

    // Route to get the user that needs to be edited
    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id; // Assign the _id from parameters to variable
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                // Check if logged in user was found in database
                if (!mainUser) {
                    res.json({ success: false, message: 'No user found' }); // Return error
                } else {
                    // Check if logged in user has editing privileges
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        // Find the user to be editted
                        User.findOne({ _id: editUser }, function (err, user) {
                            if (err) {
                                res.json({ success: false, message: 'Something went wrong.' });
                            } else {
                                // Check if user to edit is in database
                                if (!user) {
                                    res.json({ success: false, message: 'No user found' }); // Return error
                                } else {
                                    res.json({ success: true, user: user }); // Return the user to be editted
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: 'Insufficient Permission' }); // Return access error
                    }
                }
            }
        });
    });

    // Route to update/edit a user
    router.put('/edit', function (req, res) {
        var editUser = req.body._id; // Assign _id from user to be editted to a variable
        if (req.body.name) var newName = req.body.name; // Check if a change to name was requested
        if (req.body.username) var newUsername = req.body.username; // Check if a change to username was requested
        if (req.body.email) var newEmail = req.body.email; // Check if a change to e-mail was requested
        if (req.body.permission) var newPermission = req.body.permission; // Check if a change to permission was requested
        // Look for logged in user in database to check if have appropriate access
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) {
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                // Check if logged in user is found in database
                if (!mainUser) {
                    res.json({ success: false, message: "no user found" }); // Return error
                } else {
                    // Check if a change to name was requested
                    if (newName) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user in database
                            User.findOne({ _id: editUser }, function (err, user) {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong.' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.name = newName; // Assign new name to user in database
                                        // Save changes
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err); // Log any errors to the console
                                            } else {
                                                res.json({ success: true, message: 'Name has been updated!' }); // Return success message
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if a change to username was requested
                    if (newUsername) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user in database
                            User.findOne({ _id: editUser }, function (err, user) {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong.' });
                                } else {
                                    // Check if user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.username = newUsername; // Save new username to user in database
                                        // Save changes
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'Username has been updated' }); // Return success
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if change to e-mail was requested
                    if (newEmail) {
                        // Check if person making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user that needs to be editted
                            User.findOne({ _id: editUser }, function (err, user) {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong.' });
                                } else {
                                    // Check if logged in user is in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        user.email = newEmail; // Assign new e-mail to user in databse
                                        // Save changes
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err); // Log error to console
                                            } else {
                                                res.json({ success: true, message: 'E-mail has been updated' }); // Return success
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }

                    // Check if a change to permission was requested
                    if (newPermission) {
                        // Check if user making changes has appropriate access
                        if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                            // Look for user to edit in database
                            User.findOne({ _id: editUser }, function (err, user) {
                                if (err) {
                                    res.json({ success: false, message: 'Something went wrong.' });
                                } else {
                                    // Check if user is found in database
                                    if (!user) {
                                        res.json({ success: false, message: 'No user found' }); // Return error
                                    } else {
                                        // Check if attempting to set the 'user' permission
                                        if (newPermission === 'user') {
                                            // Check the current permission is an admin
                                            if (user.permission === 'admin') {
                                                // Check if user making changes has access
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error
                                                } else {
                                                    user.permission = newPermission; // Assign new permission to user
                                                    // Save changes
                                                    user.save(function (err) {
                                                        if (err) {
                                                            console.log(err); // Long error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; // Assign new permission to user
                                                // Save changes
                                                user.save(function (err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            }
                                        }
                                        // Check if attempting to set the 'moderator' permission
                                        if (newPermission === 'moderator') {
                                            // Check if the current permission is 'admin'
                                            if (user.permission === 'admin') {
                                                // Check if user making changes has access
                                                if (mainUser.permission !== 'admin') {
                                                    res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade another admin' }); // Return error
                                                } else {
                                                    user.permission = newPermission; // Assign new permission
                                                    // Save changes
                                                    user.save(function (err) {
                                                        if (err) {
                                                            console.log(err); // Log error to console
                                                        } else {
                                                            res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                        }
                                                    });
                                                }
                                            } else {
                                                user.permission = newPermission; // Assign new permssion
                                                // Save changes
                                                user.save(function (err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            }
                                        }

                                        // Check if assigning the 'admin' permission
                                        if (newPermission === 'admin') {
                                            // Check if logged in user has access
                                            if (mainUser.permission === 'admin') {
                                                user.permission = newPermission; // Assign new permission
                                                // Save changes
                                                user.save(function (err) {
                                                    if (err) {
                                                        console.log(err); // Log error to console
                                                    } else {
                                                        res.json({ success: true, message: 'Permissions have been updated!' }); // Return success
                                                    }
                                                });
                                            } else {
                                                res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to upgrade someone to the admin level' }); // Return error
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            res.json({ success: false, message: 'Insufficient Permissions' }); // Return error
                        }
                    }
                }
            }
        });
    });

    //Route to create a cultural object
    router.post('/createobject', function (req, res) {
        var object = new Object();

        object.title = req.body.title; // Save username from request to User object
        object.creator = req.body.creator;
        object.subject = req.body.subject;
        object.description = req.body.description;
        object.year = req.body.year;
        object.period = req.body.period;
        object.identifier = req.body.identifier;
        object.authors_rights = req.body.authors_rights;
        object.property_rights = req.body.property_rights;
        object.format = req.body.format;
        object.classification = req.body.classification;
        object.work_type = req.body.work_type;
        object.measurements = req.body.measurements;
        object.techniques = req.body.techniques;
        object.materials = req.body.materials;
        object.art_movement = req.body.art_movement;
        object.placement = req.body.placement;
        object.media_object = req.body.media_object;
        res.json({ success: true, message: 'object created' });
        object.save();
    });

    //Route to get all cultural objects
    router.get('/allobjects', function (req, res) {
        Object.find({}, function (err, objects) {
            if (err) throw err;
            else {
                res.json({ success: true, objects: objects });
            }
        });
    });

    //Route to get all cultural objects
    router.get('/allobjects/:creator', function (req, res) {
        console.log(req.params.creator);
        Object.findOne({ creator: req.params.creator }, function (err, object) {
            if (err) throw err;
            else {
                res.json({ success: true, object: object });
            }
        });
    });


    //Route to get all creators of cultural objects
    router.get('/allcreators', function (req, res) {
        Object.find({}, function (err, objects) {
            if (err) throw err;
            else {
                res.json({ success: true, objects: objects });
            }
        });
    });

    //Route to get all cultural objects ordered by creators
    router.get('/allobjectsbycreators', function (req, res) {
        Object.find({}, function (err, objects) {
            if (err) throw err;
            else {
                res.json({ success: true, objects: objects });
            }
        });
    });

    //Route to get all cultural objects ordered by creators
    router.get('/allobjectsbycreator', function (req, res) {
        Object.find({}, function (err, objects) {
            if (err) throw err;
            else {
                res.json({ success: true, objects: objects });
            }
        });
    });


    //Route to get one cultural object
    router.get('/object/:id', function (req, res) {
        console.log(req.params.id); // Log the ID to the console, to ensure the back end is receiving it. Then compare it to what you have in the database to make sure you have a match.
        Object.findOne({ _id: req.params.id }, function (err, object) {
            if (err) {
                throw (err);
            } else {
                // Don't always return success, check to make sure the story exists first before returning it.
                if (!object) {
                    res.json({ success: false, message: 'That object was not found.' });
                } else {
                    res.json({ success: true, object: object });
                }
            }
        });
    });

    // Route to create a story
    router.post('/createstory', function (req, res) {
        var story = new Story(); // Create new User object
        //story.user = req.body.id;
        story.story_title = req.body.story_title; // Save username from request to User object
        story.story_subtitle = req.body.story_subtitle;
        story.story_description = req.body.story_description;
        story.story_title_image = req.body.story_title_image;
        story.dogs.push({ name: 'Joe' });
        res.json({ success: true, message: 'story created' });
        story.save();
    });

    //Route to get all stories
    router.get('/allstories', function (req, res) {
        Story.find({}, function (err, stories) {
            if (err) throw err;
            else {
                res.json({ success: true, stories: stories });
                //res.send(stories); 
            }
        });
    });


    //Route to get one story
    router.get('/story/:id', function (req, res) {
        console.log(req.params.id); // Log the ID to the console, to ensure the back end is receiving it. Then compare it to what you have in the database to make sure you have a match.
        Story.findOne({ _id: req.params.id }, function (err, story) {
            if (err) {
                throw (err);
            } else {
                // Don't always return success, check to make sure the story exists first before returning it.
                if (!story) {
                    res.json({ success: false, message: 'That story was not found.' });
                } else {
                    res.json({ success: true, story: story });
                }
            }
        });
    });

    return router; // Return the router object to server
};