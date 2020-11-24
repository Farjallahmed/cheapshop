class PassportJs {

  constructor(router) {
    router.post("/facebook", this.ValidateToken);
  }

  ValidateToken(req, res) {
    console.log("here");  
    if (!req.body.access_token)
      return res.status(400).json({ message: "Tokens are invalide" });

      passport.use("facebookToken",new facebookTokenStrategy(
          {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const existingUser = await User.findOne({
                "facebook.id": profile.id,
              });

              if (existingUser) {
                return done(null, existingUser);
              }

              const newUser = new User({
                method: "facebook",
                facebook: {
                  id: profile.id,
                  email: profile.emails[0].value,
                  token: accessToken,
                },
              });

              await newUser.save();
              done(null, newUser);
            } catch (error) {
              done(error, false);
            }
          }
        )
      );

  }
  Twitter(req, res) {}
  Facebook(req, res) {}
}
module.exports = PassportJs;
