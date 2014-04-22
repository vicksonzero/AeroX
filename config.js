'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/drywall'
};
exports.companyName = 'Mobile App Dev Inc.';
exports.projectName = 'Ludo';
exports.systemEmail = 'isaacsun2@gapps.cityu.edu.hk';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS || 'isaacsun2@gapps.cityu.edu.hk'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'isaacsun2@gapps.cityu.edu.hk',
    password: process.env.SMTP_PASSWORD || 'ptjykpns91',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '1408445292761098',
    secret: process.env.FACEBOOK_OAUTH_SECRET || '9d7324e1c948c80b1c8757e1e9c10f66'
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '4c4d4a90ef810bcb24bf',
    secret: process.env.GITHUB_OAUTH_SECRET || '6a12deaaa4c6630f0aa1497f5bbc323b912de547'
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '86221171266-phimn6bv0j65mt5tega1oou7v52iopk0.apps.googleusercontent.com',
    secret: process.env.GOOGLE_OAUTH_SECRET || '9DO3X9EVrpTNJ887MAtAqcAg'
  }
};
