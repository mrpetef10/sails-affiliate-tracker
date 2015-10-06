# sails-affiliate-tracker

sails-affiliate-tracker is middleware that can be used to track your application affiliate's by
checking if an affiliate code is present in the URL.

It will assign a cookie '{referral:1234}' to the request, if one does not already exist, based on a user ID found from the username in the URL after a Users.find({username:username}) query.

This is quite a rigid package and will only work if you want your affiliate URL structures in the format of: http://mydomain.com/{unique-affiliate-username} or http://mydomain.com/page1/page2/etc/{unique-affiliate-username}.
It will not work for query strings, although it could be modified quite easily to do so. I just do not have the need to do so.

However, it does have some nifty features for SEO, in that it will NOT perform a redirect to serve the original page. Instead it will modify the req.url to
remove the affiliates username and pass that through behind the scenes - meaning your normal routes apply and controller logic for that page is executed. 

One other SEO thing it will do is provide your views with a parameter for canonical links, should it be required. You use it like this in your view files:

    <% if(typeof req.affiliateTracker !== 'undefined' && typeof req.affiliateTracker.canon !== 'undefined'){ %>
	<link rel="canonical" href="<%= sails.getBaseurl() + req.affiliateTracker.canon %>" />
	<% } %>


## Installation

Via git:

    $ git clone git://github.com/mrpetef10/sails-affiliate-tracker.git ~/.node_libraries/sails-affiliate-tracker

Via npm:

    $ npm install sails-affiliate-tracker

## Setup

There are a couple of things you must do to set this up first.

1) Require this in your config/http.js config file and add an entry 'affiliateTracker' after cookieParser:

     middleware: {
   
		affiliateTracker: require('sails-affiliate-tracker'),

	  /***************************************************************************
	  *                                                                          *
	  * The order in which middleware should be run for HTTP request. (the Sails *
	  * router is invoked by the "router" middleware below.)                     *
	  *                                                                          *
	  ***************************************************************************/

     order: [
		.....,
		.....,
		'cookieParser',
		'affiliateTracker',
		.....,
		.....,
     ],



2) Since I am still new to working with node.js/sails.js I am unsure how to actually pass custom config vars to this middleware (I would welcome anyone to create a pull request with an update to add this in!). Due to that you need to go into the node_modules/sails-affiliate-tracker/index.js file, go to line 42 and change the regex to your specific affiliate URL format. I set mine to use:

	// Will match /page1/user-mrpetef10
	// or /page1/user-anotherusername
	var regex = /^user-[\w]{5,22}$/i;

I set it in this way so that it is easily extractable from URLs and I could still if I want to in future link to my users profile pages without concern of this breaking it.

Not the best way to creating this I know, however it is an initial version that took around 15 mins to put together.