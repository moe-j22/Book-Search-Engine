const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req, res, connection }, next) {
    let token;
    // For HTTP requests (queries and mutations)
    if (req) {
      // allows token to be sent via req.query or headers
      token = req.query.token || req.headers.authorization;

      // ["Bearer", "<tokenvalue>"]
      if (req.headers.authorization) {
        token = token.split(' ').pop().trim();
      }
    } 
    // For WebSocket connections
    else if (connection) {
      token = connection.context.authorization;
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req ? (req.user = data) : (connection.context.user = data);
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
