import { AIComparisonResult } from "../../../pages/compare/page"


function FeaturesTable({ aiComparison }: { aiComparison: AIComparisonResult | null }) {
  return (
    <table className="w-full text-sm shadow-md rounded-xl overflow-hidden border border-gray-200 min-w-full table-auto ">
                        <thead className="bg-[#eef2ff] text-black uppercase text-xs">
                          <tr>
                            <th className="text-left px-4 py-3 font-semibold">
                              Feature
                            </th>
                            {aiComparison?.tools.map((tool, i) => (
                              <th
                                key={i}
                                className="text-left px-4 py-3 font-semibold"
                              >
                                {tool.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {aiComparison?.featureMatrix.map((row, i) => (
                            <tr key={i} className="hover:bg-[#fbfafd]">
                              <td className="px-4 py-3 font-medium text-gray-700">
                                {row.feature}
                              </td>
                              {aiComparison?.tools.map((tool, j) => (
                                <td key={j} className="px-4 py-3 text-gray-600">
                                  {row[tool.name]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
  )
}

export default FeaturesTable