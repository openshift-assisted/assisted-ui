import { IRow } from '@patternfly/react-table';

/**
 * Generates rows array for item which spans across all table columns.
 * Used to put EmptyState etc. components into the table body.
 */
export const getColSpanRow = (content: React.ReactNode, columnCount: number): IRow[] => [
  {
    heightAuto: true,
    cells: [
      {
        props: { colSpan: columnCount },
        title: content,
      },
    ],
  },
];
