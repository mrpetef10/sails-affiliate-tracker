/*!
 * affiliate-tracker
 * Copyright(c) 2015 Pete Mardell (https://github.com/mrpetef10)
 *
 * A simple peice of middleware for sails applications to track your website affiliates referrals to your site
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


/**
 * Constants.
 */

module.exports = function affiliateTracker(req,res,next) {
		
	// Check if this is a file request
	var reqArr = req.path.split('.');
	
	// Exclude this middleware from working on files
	if(reqArr.length > 1){
		return next();
	}
	
	// Check if the last path in the request path is a unique partner code
	var reqPaths = req.path.split('/');
	
	// Must be the home page with no affiliate code
	if(reqPaths[1].length == 0){
		return next();
	}
	
	// Extract the last path in the given URL
	var lastPath = reqPaths[reqPaths.length - 1];
	
	
	// Now check if this last path in the URL matches an affiliate code
	// Unique referrer code match
	var regex = /^user-[\w]{5,22}$/i;
	
	// We have a match! Affiliate code found
	if(regex.test(lastPath)){
	
		// Check if user already has a cookie set - in which case ignore
		if(typeof req.cookies !== 'undefined' && typeof req.cookies.referral !== 'undefined'){
			// Modify the requested path
			req.url = req.path.replace(lastPath,'');
			req.affiliateTracker = {canon:req.url};
			return next();
		}

		// Extract the username from the last path
		var username = lastPath.split('user-')[1];
		
		// Find this user in the database
		Users.find({username:username}).exec(function(err,user){
			if(err){
				return next();
			}
			
			// Assign a tracking cookie to this visitor
			res.cookie('referral', { partner: user[0].id });
			
			// TODO: Add a unique 'hit' against this partners stats
			
			// Modify the requested path
			req.url = req.path.replace(lastPath,'');
			req.affiliateTracker = {canon:req.url};
			return next();
		});
	}else{
		return next();
	}
	
};