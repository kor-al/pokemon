import "./App.css";
import React, { Component } from "react";
import data from "./pokemons";
import { scaleThreshold, scaleOrdinal } from "d3-scale";
import { schemeSet3 } from "d3-scale-chromatic";
import { groups } from "d3-array";
import getDataByOneType from "./preprocess"
import BarChart from "./Components/BarChart/BarChart";
import CircularBarChartQuadrupled from "./Components/BarChart/CircularBarChartDoubleQuadrupled";
import ViolinChart from "./Components/ViolinChart/ViolinChart";
import Dropdown from "./Components/Dropdown";
import Button from "./Components/Button";
import ScatterPlot from "./Components/ScatterPlot/ScatterPlot";
import Heatmap from "./Components/Heatmap/Heatmap";
import Card from "./Components/Card/Card"

const types = [
  "grass",
  "fire",
  "water",
  "bug",
  "normal",
  "poison",
  "electric",
  "ground",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ghost",
  "ice",
  "dragon",
  "dark",
  "steel",
  "flying",
];

const baseStats = ["defense", "attack", "hp"];

const columnsAgainst = ["against_bug","against_dark","against_dragon", "against_electric","against_fairy","against_fighting",
"against_fire","against_flying","against_ghost","against_grass","against_ground","against_ice" ,"against_normal",
"against_poison","against_psychic", "against_rock","against_steel","against_water"]

class App extends Component {
  constructor(props) {
    super(props);
    this.colorScale = scaleThreshold()
      .domain([5, 100, 500, 999])
      .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"]);
    this.colorScale_type = scaleOrdinal().domain(types).range(schemeSet3);
    this.state = {
      selectedType: "water",
      valueDropdownTypeStat: "attack",
      valueDropdownType: "water",
      valueDropdownStatX: "attack",
      valueDropdownStatY: "defense",
      team: []
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleViolinClick = this.handleViolinClick.bind(this);
    this.getFilteredDataByType = this.getFilteredDataByType.bind(this);
    this.handlScatterPlotClick = this.handlScatterPlotClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleDropdownChange(e, stateFieldString) {
    this.setState({ [stateFieldString]: e.target.value });
  }

  handleViolinClick(e) {
    this.setState({ selectedType: e.target.__data__[0] });
  }

  handlScatterPlotClick(e) {
    this.setState({ selectedName: e.target.dataset.name });
    // this.setState({ selectedType: e.target.__data__[0] });
  }

  handleButtonClick(e){
    console.log(this.state.team)
    const new_team  = [...this.state.team].concat(this.state.selectedName)
    this.setState({ team: new_team });
    console.log("NEW", new_team)
  }

  getFilteredDataByType(data, filter) {
    if (filter.value != undefined) {
      const filteredData = data.filter((d) => {
        if (filter.field.length) {
          return (
            d[filter.field[0]] === filter.value ||
            d[filter.field[1]] === filter.value
          );
        } else {
          return d[filter.field] === filter.value;
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }

  render() {
    const dataFilteredByType = this.getFilteredDataByType(data, {
      field: ["type1", "type2"],
      value: this.state.selectedType,
    });

    console.log(this.state.selectedName)

    const dataFilteredByName = data.filter(d=> d.name == this.state.selectedName)
    const dataTeam= data.filter(d=> this.state.team.includes(d.name))
    console.log(dataFilteredByName)


    const dataOneType = getDataByOneType(data)

    return (
      <div className="App">
        <header className="App-header"></header>
        <BarChart
          colorScale={this.colorScale}
          data={data}
          size={[500, 400]}
          yvariable="weight_kg"
        />
        <Dropdown
          label="Stat"
          options={baseStats.map((t) => ({ label: t, value: t }))}
          value={this.state.valueDropdownTypeStat}
          onChange={(e) =>
            this.handleDropdownChange(e, "valueDropdownTypeStat")
          }
        />
        <ViolinChart
          fillScale={this.colorScale_type}
          data={dataOneType}
          size={[800, 200]}
          yvariable={this.state.valueDropdownTypeStat}
          onClick={this.handleViolinClick}
        />
        <Dropdown
          label="Type"
          options={types.map((t) => ({ label: t, value: t }))}
          value={this.state.selectedType}
          onChange={(e) => this.handleDropdownChange(e, "selectedType")}
        />
        <Dropdown
          label="Stat X"
          options={baseStats.map((t) => ({ label: t, value: t }))}
          value={this.state.valueDropdownStatX}
          onChange={(e) => this.handleDropdownChange(e, "valueDropdownStatX")}
        />
        <Dropdown
          label="Stat Y"
          options={baseStats.map((t) => ({ label: t, value: t }))}
          value={this.state.valueDropdownStatY}
          onChange={(e) => this.handleDropdownChange(e, "valueDropdownStatY")}
        />
        <ScatterPlot
          fillScale={this.colorScale_type}
          data={dataFilteredByType}
          selectedType={this.state.selectedType}
          size={[800, 800]}
          yvariable={this.state.valueDropdownStatY}
          xvariable={this.state.valueDropdownStatX}
          onClick={this.handlScatterPlotClick}
        />
        <Card
          data={dataFilteredByName[0]}
        />
        <Button text="Add to the team" onClick={this.handleButtonClick}/>
        <CircularBarChartQuadrupled
          data={dataTeam}
          size={[600, 600]}
          y1variable={"defense"}
          y1innervariable={"attack"}
          y2variable={"sp_defense"}
          y2innervariable={"sp_attack"}
        />

        <Heatmap 
          data={dataTeam}
          size={[800, 300]}
          vars={columnsAgainst}
          items={this.state.team}/>
      </div>
    );
  }
}

export default App;
