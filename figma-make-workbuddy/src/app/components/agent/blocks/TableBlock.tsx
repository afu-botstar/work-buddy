import type { TableBlockPayload } from '../types';

interface TableBlockProps {
  payload?: TableBlockPayload;
}

export function TableBlock({ payload }: TableBlockProps) {
  const headers = payload?.headers ?? [];
  const rows = payload?.rows ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-foreground font-medium"
                  style={{ fontWeight: 600 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/60 last:border-b-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-foreground/90">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
