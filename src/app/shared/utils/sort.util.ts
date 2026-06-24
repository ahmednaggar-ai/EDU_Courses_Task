import { TableSort } from '../components/table/table.interface';

export function sortItems<T extends object>(items: T[], sort: TableSort | null | undefined): T[] {
  if (!sort?.field || !sort.order) {
    return items;
  }

  const direction = sort.order;
  const field = sort.field;

  return [...items].sort((left, right) => {
    const leftValue = (left as Record<string, unknown>)[field];
    const rightValue = (right as Record<string, unknown>)[field];

    if (leftValue == null && rightValue == null) {
      return 0;
    }

    if (leftValue == null) {
      return -1 * direction;
    }

    if (rightValue == null) {
      return 1 * direction;
    }

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return (leftValue - rightValue) * direction;
    }

    return String(leftValue).localeCompare(String(rightValue), undefined, {
      numeric: true,
      sensitivity: 'base',
    }) * direction;
  });
}
