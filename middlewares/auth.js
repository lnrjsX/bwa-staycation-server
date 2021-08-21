const isLogin = (req, res, next) => {
  if (req.session.user == null || req.session.user == undefined) {
    req.flash('alertMessage', 'Session Telah Habis!');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/signin');
  } else {
    console.log('Bagus mas');
    next();
  }
};

module.exports = isLogin;
