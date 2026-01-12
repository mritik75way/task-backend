export type RuleType = 'ROLE' | 'USER_ID' | 'PERCENTAGE'
export type RuleOperator = 'AND' | 'OR'

export interface Rule {
  type: RuleType
  value: string | number
}

export interface RuleGroup {
  operator: RuleOperator
  rules: Rule[]
}

export interface CreateFeatureInput {
  key: string
  enabled?: boolean
  allowedRoles: string[]
}

export interface UpdateFeatureInput {
  enabled?: boolean
  allowedRoles?: string[]
}
