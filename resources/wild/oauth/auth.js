var exports = module.exports = {};
    oauth2 = require('simple-oauth2'),
    path = require('path');

exports.path='wild/oauth/auth';

exports.linkedInOauth2 = oauth2({
        clientID: '77srm0ix702929',
        clientSecret: 'LBEUtu8hmsptKm4V',
        site: 'https://www.linkedin.com',
        authorizationPath: '/uas/oauth2/authorization',
        tokenPath: '/uas/oauth2/accessToken'
    });

// Authorization oauth2 URI
var authorization_uri = exports.linkedInOauth2.authCode.authorizeURL({
    redirect_uri: 'http://nucoffeechat.azurewebsites.net/callback',
    scope: 'r_basicprofile r_emailaddress',
    state: 'example-state-for-now-but-we-really-need-to-change-this'
});

exports.getHandle=function (req,res) {
	res.redirect(authorization_uri);
}


