import { Router } from 'express'
import {
  createFeatureController,
  setRuleGroupController,
  updateFeatureController
} from '../controllers/featureAdmin.controller'
import { adminMiddleware } from '../middlewares/admin.middleware'

const router = Router()

router.post('/features', adminMiddleware, createFeatureController)
router.put('/features/:key', adminMiddleware, updateFeatureController)
router.post('/features/:key/rules', adminMiddleware, setRuleGroupController)

export default router
