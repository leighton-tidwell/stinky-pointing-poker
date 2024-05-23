import { useState } from "react";

const storyPointDescriptions = [
  {
    points: 1,
    time: "~half day",
    complexity: "Little/no complexity",
    risk: "None",
  },
  { points: 2, time: "1-2 days", complexity: "Low complexity", risk: "Low" },
  {
    points: 3,
    time: "Half week",
    complexity: "Medium complexity",
    risk: "1 unknown",
  },
  {
    points: 5,
    time: "Full week",
    complexity: "Moderate complexity",
    risk: "1 - 2 unknowns",
  },
  {
    points: 8,
    time: "8-10 days/full sprint",
    complexity: "High complexity",
    risk: "2+ unknowns",
  },
  {
    points: 0,
    time: "Variable - Spike",
    complexity: "Time Box",
    risk: "Low - Medium, if high discuss why going above medium (3 days)",
  },
];

export const StoryPointsKeyTable = () => {
  const [isDefinitionCollapsed, setIsDefinitionCollapsed] = useState(true);
  const [isTableCollapsed, setIsTableCollapsed] = useState(true);

  const toggleDefinitionCollapse = () => {
    setIsDefinitionCollapsed(!isDefinitionCollapsed);
  };

  const toggleTableCollapse = () => {
    setIsTableCollapsed(!isTableCollapsed);
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <button
          className="mb-2 w-full text-left text-xl font-bold focus:outline-none"
          onClick={toggleDefinitionCollapse}
          aria-expanded={!isDefinitionCollapsed}
          aria-controls="definition-content"
        >
          Definition of Done {isDefinitionCollapsed ? "+" : "-"}
        </button>
        <div id="definition-content" hidden={isDefinitionCollapsed}>
          <p className="text-sm text-gray-700">
            The "Definition of Done" is a shared understanding among the team of
            what it means for work to be considered complete. This includes the
            completion of all tasks, successful passing of all tests, and
            adherence to all relevant standards and guidelines. This ensures
            consistency and quality in the deliverables.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            For example, a feature is considered done when:
            <ul className="list-inside list-disc">
              <li>All linting, unit and integration tests are passing.</li>
              <li>
                A merge request (MR) is created, reviewed, and approved through
                Peer and Lead Review.
              </li>
              <li>
                The code is merged into the master branch or a dedicated epic
                branch.
              </li>
            </ul>
          </p>
        </div>
      </div>
      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <button
          className="mb-2 w-full text-left text-xl font-bold focus:outline-none"
          onClick={toggleTableCollapse}
          aria-expanded={!isTableCollapsed}
          aria-controls="table-content"
        >
          Story Point Descriptions {isTableCollapsed ? "+" : "-"}
        </button>
        <div id="table-content" hidden={isTableCollapsed}>
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm leading-4 text-gray-600">
                  Points
                </th>
                <th className="border-b-2 border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm leading-4 text-gray-600">
                  Time
                </th>
                <th className="border-b-2 border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm leading-4 text-gray-600">
                  Complexity
                </th>
                <th className="border-b-2 border-gray-300 bg-gray-100 px-4 py-2 text-left text-sm leading-4 text-gray-600">
                  Task Risk/Uncertainty
                </th>
              </tr>
            </thead>
            <tbody>
              {storyPointDescriptions.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border-b border-gray-300 px-4 py-2">
                    {row.points}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {row.time}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {row.complexity}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {row.risk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
