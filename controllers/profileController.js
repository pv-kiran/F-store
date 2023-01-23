const User = require('../models/user');


const getUserProfile = async (req,res) => {
    const {id} = req.params;
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const user = await User.find({_id: id});
        console.log(user);
        res.render('userprofile' , {user: user[0] , isLoggedIn: isLoggedIn , id: req.session._userId}); 
    } catch(e) {
        console.log(e);
    }
    
}

const addAdressController = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.find({_id: id});
        user[0].address.push(req.body);
        user[0].save();
        res.redirect(`/profile/${user[0]._id}`);
    } catch(e) {
        console.log(e);
    }
}


const getAddressController = async (req,res) => {
    const {id} = req.params;
    const userId = req.session._userId;
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const user = await User.find({_id: userId});
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() === id ;
        })
        const address = user[0].address[index];
        console.log(address);
        res.render('usereditprofile' , {user: user[0] , address: address , isLoggedIn: isLoggedIn , id: req.session._userId});
    } catch(e) {
        console.log(e);
    }
}

const updateAddressController = async (req,res) => {
    const {id} = req.params;
    const userId = req.session._userId;
    const { houseName , phone , city , postalCode , state, coutry } = req.body ;
    try {
        const user = await User.find({_id: userId});
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() === id ;
        })
        console.log(index);
        user[0].address[index].houseName = houseName;
        user[0].address[index].phone = phone;
        user[0].address[index].city = city;
        user[0].address[index].postalCode = postalCode;
        user[0].address[index].state = state;
        user[0].address[index].coutry = coutry;
        await user[0].save();
        console.log(user[0]);
        res.json({redirect: `/profile/${user[0]._id}`});
    } catch(e) {
        console.log(e);
    }
    
}

const removeAddressController = async (req,res) => {
    const {id} = req.params;
    const userId = req.session._userId;
    try {
        const user = await User.find({_id: userId});
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() === id ;
        })
        console.log(index);
        user[0].address.splice(index , 1);
        await user[0].save();
        res.json({redirect: `/profile/${user[0]._id}`});
    } catch(e) {
        console.log(e);
    }
    
}

const updateUserController = async (req,res) => {
    const {id} = req.params ;
    console.log(id);
    console.log(req.body);
    try {
       const user = await User.findByIdAndUpdate(id , req.body , {
           new: true
       });
       res.json({redirect: `/profile/${id}`});
    } catch(e) {
       console.log(e);
    }
}

const getChangePasswordForm = async (req,res) => {
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {
        const user = await User.find({_id: req.session._userId});
        console.log(user);
        res.render('changepassword' , {user: user[0] , isLoggedIn: isLoggedIn , id: req.session._userId}); 
    } catch(e) {
        console.log(e);
    }
}


const changeUserPassword = async (req,res) => {
    let isLoggedIn;
    if(req.session.userid) {
      isLoggedIn = true
    } else {
        isLoggedIn = false
    }
    try {

        const encPassword = await bcrypt.hash(req.body.password , 10);
        console.log(encPassword);
        

        req.body.password = encPassword;
        // console.log(req.body);
        // console.log(req.body);

        const user = await User.findByIdAndUpdate(req.session.id , req.body);

        res.json({redirect: `/profile/${req.session._userId}`});
    
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    getUserProfile , 
    addAdressController , 
    getAddressController ,
    updateAddressController ,
    removeAddressController ,
    updateUserController ,
    getChangePasswordForm ,
    changeUserPassword
}