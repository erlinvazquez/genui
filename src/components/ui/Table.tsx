import React from 'react';
import { cn } from '../../utils/cn';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function Table<T>({
  data,
  columns,
  className,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full divide-y divide-gray-300', className)}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key.toString()}
                  className="px-6 py-4 text-sm text-gray-500"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}