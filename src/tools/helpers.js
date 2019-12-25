import jwt from 'jsonwebtoken';

// gets if the user is authenticated by their JWT
// use cb because of async
export const isAuth = (token, cb) => {
  jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
    if (err) {
      cb({ success: false, data: err });
    } else {
      cb({ success: true, data: decoded});
    }
  });
};

// grabs a random element from the provided array
export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
