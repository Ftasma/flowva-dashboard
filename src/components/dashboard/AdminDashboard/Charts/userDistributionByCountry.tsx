import React from "react";
import Plot from "react-plotly.js";

type Props = {
  countryCodes: string[]; // ISO-3 codes for the map
  countryNames: string[]; // Full country names for hover
  userCounts: number[];
};

const UsersByCountryMap: React.FC<Props> = ({ countryCodes, countryNames, userCounts }) => {
  return (
    <Plot
      data={[
        {
          type: "choropleth",
          locationmode: "ISO-3",
          locations: countryCodes,
          z: userCounts,
          colorscale: [[0, "#f0e5ff"], [1, "#9013fe"]], // gradient from light to primary
          marker: {
            line: {
              color: "rgb(180,180,180)",
              width: 0.5,
            },
          },
          colorbar: {
            title: { text: "Users" },
          },
          text: countryNames,
          hovertemplate: '%{text}<br>Users: %{z}<extra></extra>', // custom hover
        } as Partial<Plotly.PlotData>,
      ]}
      layout={{
        geo: {
          projection: { type: "robinson" },
        },
      }}
      style={{ width: "100%", height: "600px" }}
    />
  );
};

export default UsersByCountryMap;
