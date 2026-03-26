//middleware pentru roluri (studentul nu poate face lucrurile pe care profesorul le poate face ex: sa creeze sesiune)
module.exports = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: "Acces denied!You don't have permission to do this action!" });
        }
        next();
    };
};
