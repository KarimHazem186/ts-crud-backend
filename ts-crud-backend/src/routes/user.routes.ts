import express from 'express'
const router = express.Router()
import userController from '../controllers/user.controller.js'


router.route('/')
    .post(userController.createUser)
    .get(userController.getUsers)

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser)


export default router;