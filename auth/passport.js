const bcrypt = require("bcryptjs");
LocalStrategy = require("passport-local").Strategy;

//Load model

const User = require("../models/").user;

const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //Check customer
      console.log(User);
      User.findOne({ where: {email} })
        .then((user) => {
          if (!user) {
            console.log("wrong email");
            return done();
          }

          //Match Password

          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            } else {
              console.log("Wrong password");
              return done();
            }
          });
        })
        .catch((error) => console.log(error));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({where: {id}}).then(user => {
      done(null, user);
    }). catch(err => {
      done(err, null);
    });
  });
};

module.exports = {
  loginCheck,
};
