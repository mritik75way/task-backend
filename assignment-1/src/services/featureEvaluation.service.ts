import { findFeatureByKey } from '../repositories/feature.repository'
import { Rule, RuleGroup } from '../types/feature.types'
import { AuthUser } from '../types/user.types'

export const evaluateRule = (rule: Rule, user: AuthUser): boolean => {
  if (rule.type === 'ROLE') {
    return user.roles.includes(rule.value as string)
  }

  if (rule.type === 'USER_ID') {
    return String(user._id ?? user.id) === String(rule.value)
  }

  if (rule.type === 'PERCENTAGE') {
    const id = String(user._id ?? user.id)
    const hash = Math.abs(
      [...id].reduce((a, c) => a + c.charCodeAt(0), 0)
    )
    return hash % 100 < (rule.value as number)
  }

  return false
}

export const evaluateRuleGroup = (
  ruleGroup: RuleGroup,
  user: AuthUser
): boolean => {
  const results = ruleGroup.rules.map(rule =>
    evaluateRule(rule, user)
  )

  return ruleGroup.operator === 'AND'
    ? results.every(Boolean)
    : results.some(Boolean)
}

export const evaluateFeature = async (
  key: string,
  user: AuthUser
) => {
  const feature = await findFeatureByKey(key)

  if (!feature) {
    return { enabled: false, reason: 'FEATURE_NOT_FOUND' }
  }

  if (!feature.enabled) {
    return { enabled: false, reason: 'FEATURE_DISABLED' }
  }

  const hasRole = user.roles.some(role =>
    feature.allowedRoles.includes(role)
  )

  if (!hasRole) {
    return { enabled: false, reason: 'ROLE_RESTRICTED' }
  }

  if (!feature.ruleGroup) {
    return { enabled: true, reason: 'NO_RULES' }
  }

  const matched = evaluateRuleGroup(feature.ruleGroup as RuleGroup, user)

  return {
    enabled: matched,
    reason: matched ? 'RULE_MATCHED' : 'RULE_NOT_MATCHED'
  }
}
