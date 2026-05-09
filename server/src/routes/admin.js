const express = require('express');
const {
  getUsers, updateUserRole, deleteUser, getAllOrders,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users',                getUsers);
router.patch('/users/:id/role',     updateUserRole);
router.delete('/users/:id',         deleteUser);
router.get('/orders',               getAllOrders);

module.exports = router;
