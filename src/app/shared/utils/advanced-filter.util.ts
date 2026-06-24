import {
  AdvancedFilterGroup,
  AdvancedFilterOperator,
  AdvancedFilterRule,
} from '../interfaces/advanced-filter.interface';

function getFieldValue(item: Record<string, unknown>, field: string): unknown {
  return item[field];
}

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function evaluateRule(item: Record<string, unknown>, rule: AdvancedFilterRule): boolean {
  if (rule.value === null || rule.value === '') {
    return true;
  }

  const fieldValue = getFieldValue(item, rule.field);
  const operator = rule.operator;

  if (typeof rule.value === 'number' || operator === 'greaterThan' || operator === 'lessThan') {
    const numericField = Number(fieldValue);
    const numericRule = Number(rule.value);

    if (Number.isNaN(numericField) || Number.isNaN(numericRule)) {
      return false;
    }

    if (operator === 'greaterThan') {
      return numericField > numericRule;
    }

    if (operator === 'lessThan') {
      return numericField < numericRule;
    }

    return numericField === numericRule;
  }

  const left = normalizeText(fieldValue);
  const right = normalizeText(rule.value);

  switch (operator as AdvancedFilterOperator) {
    case 'equals':
      return left === right;
    case 'startsWith':
      return left.startsWith(right);
    case 'contains':
    default:
      return left.includes(right);
  }
}

export function applyAdvancedFilters<T extends object>(
  items: T[],
  group: AdvancedFilterGroup | null | undefined,
): T[] {
  if (!group?.rules.length) {
    return items;
  }

  const activeRules = group.rules.filter(
    (rule) => rule.value !== null && rule.value !== '',
  );

  if (!activeRules.length) {
    return items;
  }

  const filterGroup: AdvancedFilterGroup = { ...group, rules: activeRules };

  return items.filter((item) => {
    const results = filterGroup.rules.map((rule) =>
      evaluateRule(item as Record<string, unknown>, rule),
    );

    return filterGroup.logic === 'and' ? results.every(Boolean) : results.some(Boolean);
  });
}

export function hasActiveAdvancedFilters(group: AdvancedFilterGroup | null | undefined): boolean {
  return !!group?.rules.some((rule) => rule.value !== null && rule.value !== '');
}
