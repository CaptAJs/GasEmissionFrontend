import React, { Component } from "react";
import { Line } from "react-chartjs-2";
const bgc = [
  "#0ff1ce",
  "#bada55",
  "#7fe5f0",
  "#ff0000",
  "#065535",
  "#5ac18e",
  "#003366",
  "#000080",
  "#333333",
  "#ff7f50",
];
export class GraphPlot extends Component {
  state = {
    chart: [],
    dataSets: [],
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.label !== this.props.label ||
      prevProps.gasValueSet !== this.props.gasValueSet
    ) {
      let label = [],
        index = 0;
      for (const [gasKey, gasValueList] of Object.entries(
        this.props.gasValueSet
      )) {
        label.push({
          label: gasKey,
          backgroundColor: bgc[index++],
          borderColor: "#484848",
          borderWidth: 2,
          data: gasValueList,
        });
      }

      this.setState({
        chart: {
          labels: this.props.label.map((yearObj) => yearObj.year),
          datasets: label,
        },
      });
    }
  }
  render() {
    return (
      <div>
        <h3>Gas Emission Graph</h3>
        <Line
          data={this.state.chart}
          options={{
            title: {
              display: true,
              text: "Gas Emission",
              fontSize: 20,
            },
            legend: {
              display: false,
              position: "right",
            },
          }}
        />
      </div>
    );
  }
}

export default GraphPlot;
