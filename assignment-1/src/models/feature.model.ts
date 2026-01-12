import { Schema, model } from 'mongoose'

const ruleSchema = new Schema(
  {
    type: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
)

const ruleGroupSchema = new Schema(
  {
    operator: { type: String, enum: ['AND', 'OR'], required: true },
    rules: { type: [ruleSchema], required: true }
  },
  { _id: false }
)

const featureSchema = new Schema({
  key: { type: String, unique: true, required: true },
  enabled: { type: Boolean, default: false },
  allowedRoles: { type: [String], required: true },
  ruleGroup: { type: ruleGroupSchema }
}, {timestamps: true})

export const FeatureModel = model('Feature', featureSchema)
