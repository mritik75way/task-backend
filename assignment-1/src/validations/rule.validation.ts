import { z } from 'zod'

const ruleSchema = z.object({
  type: z.enum(['USER_ID', 'ROLE', 'PERCENTAGE']),
  value: z.any()
})

export const createRuleGroupValidation = z.object({
  operator: z.enum(['AND', 'OR']),
  rules: z.array(ruleSchema).min(1)
})
