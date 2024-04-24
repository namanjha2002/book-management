const express = require('express')
const router = express.Router()

const {registerUser,userLogin} = require('../controller/userController')
const {addBook,updateBook,getBook,deleteBook} = require('../controller/bookController')
const auth = require('../middleware/auth')

router.post('/api/register-user', registerUser)
router.post('/api/login', userLogin)
router.post('/api/add-book',auth,addBook)
router.put('/api/update-book',auth,updateBook)
router.get('/api/get-filter-book',auth,getBook)
router.delete('/api/delete-book/:id',auth,deleteBook)

module.exports = router;