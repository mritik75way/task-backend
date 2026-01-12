import { z } from 'zod'

export const createFeatureValidation = z.object({
  key: z.string().min(1),
  enabled: z.boolean().optional(),
  allowedRoles: z.array(z.string()).min(1)
})

export const updateFeatureValidation = z.object({
  enabled: z.boolean().optional(),
  allowedRoles: z.array(z.string()).optional()
})

export const ruleValidation = z.object({
  type: z.enum(['USER_ID', 'ROLE', 'PERCENTAGE']),
  value: z.union([z.string(), z.number()])
})

export const ruleGroupValidation = z.object({
  operator: z.enum(['AND', 'OR']),
  rules: z.array(ruleValidation).min(1)
})
