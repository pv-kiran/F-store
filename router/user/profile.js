const express = require('express');
const router = express.Router();

const { getUserProfile, addAdressController, getAddressController, removeAddressController, updateAddressController} = require('../../controllers/profileController');

router.get('/:id' , getUserProfile);

router.post('/address/:id' , addAdressController);

router.get('/address/:id' , getAddressController)

router.put('/address/:id' , updateAddressController);

router.delete('/address/:id' , removeAddressController);




module.exports = router;