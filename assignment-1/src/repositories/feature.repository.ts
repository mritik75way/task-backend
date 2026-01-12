import { FeatureModel } from '../models/feature.model'
import { CreateFeatureInput, RuleGroup, UpdateFeatureInput } from '../types/feature.types'

export const createFeature = async (data: CreateFeatureInput) => {
  return FeatureModel.create(data)
}

export const updateFeature = async (key: string, data: UpdateFeatureInput) => {
  
  return FeatureModel.findOneAndUpdate({
    key
  }, data, { new: true })
}

export const findFeatureByKey = async (key: string) => {
  return FeatureModel.findOne({ key })
}
export const updateRuleGroup = async (
  key: string,
  ruleGroup: RuleGroup
) => {
  return FeatureModel.findOneAndUpdate(
    { key },
    { ruleGroup },
    { new: true }
  )
}