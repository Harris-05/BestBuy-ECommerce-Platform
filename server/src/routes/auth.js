const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../utils/validations');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/logout',   logout);
router.get('/me',        protect, getMe);
router.post('/forgotpassword', validate(forgotPasswordSchema), forgotPassword);
router.put('/resetpassword/:resettoken', validate(resetPasswordSchema), resetPassword);

module.exports = router;
