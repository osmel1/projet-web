const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
//the main function :  initialize
function initialize(passport, getUserByEmail, getUserById) {
//the sub fonction to check the user(email , password) and we pass another function to return errors if it's the case(error of the server,the user,the message of error)
  const authenticateUser = async (email, password, done) => {
    const user =await getUserByEmail(email)
    //check if there is a user have this email
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
          //after checking the email now is the role of the passwor we compare it whit bcrypt.compare because in the database we have only the hashedPassword
          if (user.password == password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize