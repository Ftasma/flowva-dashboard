import { AIComparisonResult } from "../../../pages/compare/page";

function SummaryTable({ aiComparison }: { aiComparison: AIComparisonResult | null }) {
  return (
    <table className="min-w-full table-auto w-full text-sm shadow-md rounded-xl overflow-hidden border border-gray-200 ">
      <thead className="bg-[#eef2ff] text-black uppercase text-xs">
        <tr>
          <th className="text-left px-4 py-3 font-semibold">Metric</th>
          {aiComparison?.tools.map((tool, idx) => (
            <th key={idx} className="text-left px-4 py-3 font-semibold">
              {tool.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        <tr className="hover:bg-[#fbfafd]">
          <td className="px-4 py-3 font-medium text-gray-700">Overview</td>
          {aiComparison?.tools.map((tool, i) => (
            <td key={i} className="px-4 py-3 text-gray-600">
              {tool.overview}
            </td>
          ))}
        </tr>
        <tr className="hover:bg-[#fbfafd]">
          <td className="px-4 py-3 font-medium text-gray-700">Best For</td>
          {aiComparison?.tools.map((tool, i) => (
            <td key={i} className="px-4 py-3 text-gray-600">
              {tool.bestFor}
            </td>
          ))}
        </tr>
        <tr className="hover:bg-[#fbfafd]">
          <td className="px-4 py-3 font-medium text-gray-700">Pricing</td>
          {aiComparison?.tools.map((tool, i) => (
            <td key={i} className="px-4 py-3 text-gray-600">
              {tool.pricing}
            </td>
          ))}
        </tr>
        <tr className="hover:bg-[#fbfafd]">
          <td className="px-4 py-3 font-medium text-gray-700">Pros</td>
          {aiComparison?.tools.map((tool, i) => (
            <td key={i} className="px-4 py-3 text-green-700">
              <ul className="list-disc pl-5">
                {tool.pros.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </td>
          ))}
        </tr>
        <tr className="hover:bg-[#fbfafd]">
          <td className="px-4 py-3 font-medium text-gray-700">Cons</td>
          {aiComparison?.tools.map((tool, i) => (
            <td key={i} className="px-4 py-3 text-red-700">
              <ul className="list-disc pl-5">
                {tool.cons.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default SummaryTable;
