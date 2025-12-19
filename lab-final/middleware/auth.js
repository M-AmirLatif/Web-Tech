exports.checkCartNotEmpty = (req, res, next) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect('/cart')
  }
  next()
}
exports.adminOnly = (req, res, next) => {
  if (req.session.email !== 'admin@shop.com') {
    return res.status(403).send('Access Denied: Admins only')
  }
  next()
}
