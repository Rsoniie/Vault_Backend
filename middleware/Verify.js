import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    try {
        const verifiedUser = jwt.verify(bearerToken, process.env.SECRET_KEY);
        req.user = verifiedUser;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

export default verifyUser;
