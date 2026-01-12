import { Router } from 'express'
import { evaluateFeatureController } from '../controllers/featureEvaluation.controller'

const router = Router()

router.get('/evaluate/:key', evaluateFeatureController)

export default router;
