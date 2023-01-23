const express = require('express');
const router = express.Router();


const User = require('../../models/user');


const { getUserProfile, addAdressController, getAddressController, removeAddressController, updateAddressController} = require('../../controllers/profileController');



router.get('/:id' , getUserProfile);

router.post('/address/:id' , addAdressController);

router.get('/address/:id' , getAddressController);

router.put('/address/:id' , updateAddressController);

router.delete('/address/:id' , removeAddressController);

router.put('/username/:id' , async (req,res) => {
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
})


module.exports = router;