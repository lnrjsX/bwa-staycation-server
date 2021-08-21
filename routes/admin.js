const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');

router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth);
router.get('/logout', adminController.actionLogout);

router.get('/dashboard', adminController.viewDashboard);

// category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.hapusCategory);

// Bank
router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', adminController.hapusBank);

// Item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/show-image/:id', adminController.viewImageItem);
router.get('/item/:id', adminController.viewEditItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.delete('/item/:id/delete', adminController.deleteItem);

// detail Item Feature
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', upload, adminController.addFeature);
router.put('/item/update/feature', upload, adminController.editFeature);
router.delete('/item/delete/feature/:id', adminController.deleteFeature);

// detail Item Activity
router.post('/item/add/activity', upload, adminController.addActivity);
router.put('/item/update/activity', upload, adminController.editActivity);
router.delete('/item/delete/activity/:id', adminController.deleteActivity);

// Booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.viewDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);

module.exports = router;
