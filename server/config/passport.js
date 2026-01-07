import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.isVerified = true; // Google emails are verified
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        isVerified: true,
        preferences: {
          favorites: [],
          settings: {}
        }
      });
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

// Note: Facebook strategy would be similar
// Uncomment and configure if Facebook OAuth is needed

/*
import { Strategy as FacebookStrategy } from 'passport-facebook';

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        user.facebookId = profile.id;
        user.isVerified = true;
        await user.save();
        return done(null, user);
      }
      
      user = await User.create({
        facebookId: profile.id,
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        isVerified: true,
        preferences: {
          favorites: [],
          settings: {}
        }
      });
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));
*/

export default passport;
