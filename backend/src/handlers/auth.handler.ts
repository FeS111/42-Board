import { Application } from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';
import { AUTH_SECRET, AUTH_UID } from '../vars.global';
var FortyTwoStrategy = require('passport-42').Strategy;

export const registerAuthHandler = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new FortyTwoStrategy(
      {
        clientID: AUTH_UID,
        clientSecret: AUTH_SECRET,
        callbackURL: 'http://localhost:8080/auth/42/callback'
      },
      (accessToken: string, refreshToken: string, profile: any, cb: (err: any, user: any) => any) => {
        (async () => {
          try {
            let user = await User.findOne({ intraId: profile.id });
            if (!user) {
              profile = profile._json;
              user = await new User({
                intraId: String(profile.id),
                username: profile.login,
                displayName: profile.displayname,
                name: {
                  familyName: profile.last_name,
                  givenName: profile.first_name
                },
                profileUrl: profile.url,
                email: profile.email,
                phoneNumber: profile.phone,
                photo: profile.image_url
              }).save();
            }
            cb(null, user);
          } catch (error) {
            cb(error, null);
          }
        })();
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.intraId);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ intraId: id })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });

  app.get('/auth/login', passport.authenticate('42'));

  app.get('/auth/42/callback', passport.authenticate('42', { failureRedirect: '/auth/login' }), function (req, res) {
    res.redirect('http://localhost:5173/');
  });

  app.get('/auth/status', isAuthenticated, (req, res) => res.send(req.user));
};