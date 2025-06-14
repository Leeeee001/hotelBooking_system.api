// auth provider stratergy(login with google)
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/users.model");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Decode the role from the state
        const state = JSON.parse(
          Buffer.from(req.query.state, "base64").toString()
        );
        const role = state.role || "user";

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name,
            email,
            provider: "google",
            google_id: profile.id,
            is_verified: true,
            role,
          });
          await user.save();
        }

        // Send welcome mail
        const nameFirst = user.name.split(" ")[0];
        const bookingLink = "http://localhost:3000/";

        await sendEmail({
          to: user.email,
          subject: "🎉 Welcome to Luxury Hotels!",
          template: "welcomeMail",
          context: { name: nameFirst, bookingLink },
        });

        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.SECRET,
          { expiresIn: process.env.TOKEN_EXPIRY }
        );

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
