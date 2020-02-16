function isloggedIn(req) {
	if (req.session && req.session.login) {
		return true;
	}
	return false;
}

module.exports = isloggedIn;

