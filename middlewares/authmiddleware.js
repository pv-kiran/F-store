const isLoggedIn = (req,res, next) => {
    session=req.session;
    if(session.userid){
        next();
    } else {
        res.redirect('/user/signin');
    }
}

const isAdminLoggedIn = (req,res, next) => {
    session=req.session;
    if(session.adminId){
        next();
    } else {
        res.redirect('/user/signin');
    }
}


module.exports = {
    isLoggedIn ,
    isAdminLoggedIn
}