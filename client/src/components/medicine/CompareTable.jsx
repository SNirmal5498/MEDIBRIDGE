import { formatINR } from "../../utils/helpers";

const ROWS = [
  { key: "strength", label: "Strength" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "price", label: "Price", format: formatINR },
  { key: "otc", label: "OTC", format: (v) => (v ? "Yes" : "No — Rx only") },
];

export default function CompareTable({ medicines, highlightId }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 pr-4 font-semibold text-text-muted w-32">Brand</th>
            {medicines.map((med) => (
              <th
                key={med.id}
                className={`text-left py-3 px-4 font-semibold whitespace-nowrap ${
                  med.id === highlightId ? "text-primary-hover" : "text-text"
                }`}
              >
                {med.brand}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-b border-border last:border-0">
              <td className="py-3 pr-4 text-text-muted font-medium whitespace-nowrap">{row.label}</td>
              {medicines.map((med) => (
                <td
                  key={med.id}
                  className={`py-3 px-4 whitespace-nowrap ${
                    med.id === highlightId ? "text-primary-hover font-semibold" : "text-text"
                  }`}
                >
                  {row.format ? row.format(med[row.key]) : med[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}