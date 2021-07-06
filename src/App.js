import { Component } from "react";
import "./App.css";
import gasEmissionData from "./output.json";
import { Gases } from "./components/common/GasesList";
import InputSelect from "./components/selector/InputSelect";
import { isSubset } from "./components/common/FindSubset";
import { withRouter } from "react-router-dom";
class App extends Component {
  state = {
    countriesList: [],
    yearsList: [],
    gasesList: [],
    country: "",
    year: "",
    gases: [],
    gasesValue: {},
  };

  componentDidMount() {
    let countriesList = [],
      yearsList = [],
      gasesList = [];
    for (const [countryName, yearData] of Object.entries(gasEmissionData)) {
      countriesList.push({
        country: countryName,
        disabled: false,
      });
    }
    for (let year = 1990; year <= 2014; year++) {
      yearsList.push({
        year: year,
        disabled: false,
      });
    }
    for (const [gas, gasValue] of Object.entries(Gases)) {
      gasesList.push({
        gas: gas,
        gasValue: gasValue,
        disabled: false,
      });
    }
    this.setState({
      countriesList,
    });
    this.setState({ yearsList });
    this.setState({ gasesList });
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const { country, year, gas } = params;
    let gasList = [];
    if (gas) {
      gasList = gas.split(",");
    }
    const countryExist = countriesList.some(
      (countryObj) => countryObj.country === country
    );
    const yearExist = yearsList.some(
      (yearObj) => yearObj.year === Number(year)
    );
    const inputGasesList = [...new Set(gasList)];
    const gasExist = isSubset(gasesList, inputGasesList);
    if (countryExist) this.setState({ country: country });
    if (yearExist) this.setState({ year: Number(year) });
    if (gasExist) this.setState({ gases: inputGasesList });
    if (countryExist && (yearExist || gasExist)) {
      let gasValueList = {};
      for (const [eachYear, eachYearData] of Object.entries(
        gasEmissionData[country]
      )) {
        for (const [gas, gasVal] of Object.entries(eachYearData)) {
          const gasKey = Object.keys(Gases).find((key) => Gases[key] === gas);
          if (!gasValueList[gasKey]) gasValueList[gasKey] = [];
          gasValueList[gasKey].push(gasVal);
        }
      }
      this.setState({ gasesValue: gasValueList });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.country &&
      this.state.year &&
      (prevState.year !== this.state.year ||
        (this.state.gases.length && prevState.gases !== this.state.gases))
    ) {
      let gasValueList = {};
      for (const [eachYear, eachYearData] of Object.entries(
        gasEmissionData[this.state.country]
      )) {
        for (const [gas, gasVal] of Object.entries(eachYearData)) {
          const gasKey = Object.keys(Gases).find((key) => Gases[key] === gas);

          if (this.state.year === Number(eachYear)) {
            if (this.state.gases.includes(gasKey)) {
              if (!gasValueList[gasKey]) gasValueList[gasKey] = [];
              gasValueList[gasKey].push(gasVal);
            }
          } else if (this.state.gases.length) {
            if (!gasValueList[gasKey]) gasValueList[gasKey] = [];
            gasValueList[gasKey].push(null);
          }
        }
      }
      this.setState({ gasesValue: gasValueList });
    } else if (
      this.state.country &&
      (prevState.country !== this.state.country ||
        (this.state.gases.length && prevState.gases !== this.state.gases) ||
        this.state.year !== prevState.year)
    ) {
      let gasValueList = {};
      for (const [eachYear, eachYearData] of Object.entries(
        gasEmissionData[this.state.country]
      )) {
        for (const [gas, gasVal] of Object.entries(eachYearData)) {
          const gasKey = Object.keys(Gases).find((key) => Gases[key] === gas);
          if (this.state.gases.includes(gasKey)) {
            if (!gasValueList[gasKey]) gasValueList[gasKey] = [];
            gasValueList[gasKey].push(gasVal);
          }
        }
      }
      this.setState({ gasesValue: gasValueList });
    } else if (
      !this.state.gases.length &&
      prevState.gases !== this.state.gases
    ) {
      this.setState({ gasesValue: {} });
    }
    if (
      prevState.country !== this.state.country ||
      prevState.year !== this.state.year ||
      prevState.gases !== this.state.gases
    ) {
      if (this.state.country && this.state.year && this.state.gases.length)
        this.props.history.push(
          "/?country=" +
            this.state.country +
            "&year=" +
            this.state.year +
            "&gas=" +
            this.state.gases.toString()
        );
      else if (this.state.country && this.state.year)
        this.props.history.push(
          "/?country=" + this.state.country + "&year=" + this.state.year
        );
      else if (this.state.country && this.state.gases.length)
        this.props.history.push(
          "/?country=" +
            this.state.country +
            "&gas=" +
            this.state.gases.toString()
        );
      else if (this.state.year && this.state.gases.length)
        this.props.history.push(
          "/?year=" + this.state.year + "&gas=" + this.state.gases.toString()
        );
    }
  }

  setCountryState = (country) => {
    this.setState({
      country: country,
    });
    if (!(this.state.year && this.state.gases))
      this.props.history.push("/?country=" + country);
  };
  setYearState = (year) => {
    this.setState({
      year: Number(year),
    });
    if (!(this.state.country && this.state.gases))
      this.props.history.push("/?year=" + year);
  };
  setGasesListState = (gasesList, gasName) => {
    let gasesListState = gasesList.map((gas) => {
      return {
        gas: gas.name,
        gasValue: gas[gas.name],
        disabled: gas.disabled,
      };
    });
    const gasIndex = this.state.gases.findIndex((gas) => gas === gasName);
    let gases = [...this.state.gases];
    gases.splice(gasIndex, 1);

    this.setState({ gasesList: gasesListState });
    this.setState({ gases: gases });
  };
  setGasState = (gas) => {
    const gasesListIndex = this.state.gasesList.findIndex(
      (gases) => gases.gas === gas
    );
    const gasesList = [...this.state.gasesList];
    gasesList[gasesListIndex]["disabled"] = true;
    const findGasStateIndex = this.state.gases.findIndex(
      (currentGas) => gas === currentGas
    );

    this.setState(gasesList);
    if (findGasStateIndex === -1) {
      let selectedGasList = [...this.state.gases];
      selectedGasList.push(gas);
      this.setState({
        gases: selectedGasList,
      });
      if (!(this.state.country && this.state.year))
        this.props.history.push("/?gas=" + selectedGasList.toString());
    }
  };
  render() {
    return (
      <div className="App">
        <h2>Blue Sky Analytics</h2>
        <InputSelect
          countriesList={this.state.countriesList}
          country={this.state.country}
          yearsList={this.state.yearsList}
          year={this.state.year}
          gasesList={this.state.gasesList}
          gases={this.state.gases}
          setCountryState={(e, country) => this.setCountryState(e, country)}
          setYearState={(e, year) => this.setYearState(e, year)}
          setGasState={(e, gas) => this.setGasState(e, gas)}
          setGasesListState={(gasesList, gasName) =>
            this.setGasesListState(gasesList, gasName)
          }
          gasesValueList={this.state.gasesValue}
        />
      </div>
    );
  }
}
export default withRouter(App);
