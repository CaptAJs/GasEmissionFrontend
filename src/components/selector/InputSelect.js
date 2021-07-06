import React, { Component } from "react";
import ReactSelect from "../common/ReactSelect";
import "./InputSelect.css";
import GraphPlot from "../graph/GraphPlot.js";
export class InputSelect extends Component {
  state = {
    disableCountry: false,
    disableYear: true,
    disableGas: true,
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.country &&
      !this.state.disableCountry &&
      this.state.disableYear
    ) {
      this.setState({ disableYear: false, disableGas: false });
    }
  }
  handleBlur = () => {
    console.log(this.props.countriesList);
  };

  render() {
    return (
      <React.Fragment>
        <h3 className="input-parameters">Input Parameters</h3>
        <div className="parameter-container">
          <div className="country-input">
            <ReactSelect
              disabled={false}
              onBlur={this.props.handleBlur}
              value={this.props.country}
              onSelect={(selectedHandler) => {
                this.props.setCountryState(selectedHandler.name);
              }}
              defaultText="Country"
              optionsList={this.props.countriesList.map((item, index) => ({
                name: item.country,
                key: index,
                disabled: item.disabled,
              }))}
              isMultiSelect={false}
            />
          </div>
          <div className="year-input">
            <ReactSelect
              disabled={this.state.disableYear}
              onBlur={this.props.handleBlur}
              value={this.props.year}
              onSelect={(selectedHandler) => {
                this.props.setYearState(selectedHandler.name);
              }}
              defaultText="Year"
              optionsList={this.props.yearsList.map((item, index) => ({
                name: item.year,
                disabled: item.disabled,
                key: index,
              }))}
              isMultiSelect={false}
              emptySelect={true}
            />
          </div>
          <div className="gas-input">
            <ReactSelect
              disabled={this.state.disableGas}
              onBlur={this.props.handleBlur}
              value={this.props.gases}
              onSelect={(selectedHandler) => {
                this.props.setGasState(selectedHandler.name);
              }}
              defaultText="Gas"
              optionsList={this.props.gasesList.map((item, index) => ({
                name: item.gas,
                disabled: item.disabled,
              }))}
              isMultiSelect={true}
              setOptionsList={(gasesList, gasName) => {
                this.props.setGasesListState(gasesList, gasName);
              }}
            />
          </div>
        </div>
        <GraphPlot
          label={this.props.yearsList}
          gasValueSet={this.props.gasesValueList}
          year={this.props.year}
        />
      </React.Fragment>
    );
  }
}

export default InputSelect;
