exports.mustAuthenticatedMw = function (req, res, next) {
  req.isAuthenticated() ? next() : res.redirect("/login");
};
