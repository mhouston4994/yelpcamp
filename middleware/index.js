var Campground = require("../models/campground");
var Comment = require("../models/comments");
// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};
    
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground Not found");
            res.redirect("back");
        } else {
            if(!foundCampground){
            req.flash("error", "Item not found.");
            return res.redirect("back");
        }            //deos user own the campground?
        if(foundCampground.author.id.equals(req.user._id) || req.user && req.user.isAdmin){
        next();   
        }
        }
    });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //deos user own the comment?
                if(foundComment.author.id.equals(req.user._id) || req.user && req.user.isAdmin){
                next();
            } else {
                req.flash("error", "You Don't Have Permission To Do That");
                res.redirect("back");
            }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
    req.flash("error", "You Need To Be Logged In To Do That");
    res.redirect("/login");
}};
module.exports = middlewareObj;