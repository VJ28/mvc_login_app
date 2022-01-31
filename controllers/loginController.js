const passport = require("passport");
const User = require("../models/").user;
const bcrypt = require("bcryptjs");

//For Register Page
const registerView = (req, res) => {
  res.render("register", {});
};

//Post Request for Register

const registerUser = async (req, res) => {
  const { name, email, location, password, confirm } = req.body;

  if (!name || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }

  //Confirm Passwords

  if (password !== confirm) {
    console.log("Password must match");
  } else {
    //Validation
    console.log(User);
    User.findOne({ where : { email }}).then((user) => {
      if (user) {
        console.log("email exists");
        res.render("register", {
          name,
          email,
          password,
          confirm,
        });
      } else {
        //Validation
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;

              User.create({
                name,
                email,
                location,
                'password': hash,
              }).then(user => {
                res.redirect("/login");
              }).catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the User."
                });
              });
            })
          );
      }
    });
  }
};

// For View
const loginView = (req, res) => {
  res.render("login", {});
};

//Logging in Function

const logoutUser = (req, res, next) => {
  req.logout();
  res.render("logout", {});
}

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  //Required
  if (!email || !password) {
    console.log("Please fill in all the fields");
    res.render("login", {
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }
};

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser
};
