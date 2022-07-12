import "./App.css";
import "./tooltip.css";
import React, { Component } from "react";
import data from "./pokemons";
import dataFlow from "./pokemonTypesCounts";
import { scaleThreshold, scaleOrdinal } from "d3-scale";
import { schemeSet3, schemeCategory10 } from "d3-scale-chromatic";
import { groups, range } from "d3-array";
import { min, max, median } from "d3-array";
import { format } from "d3-format";
import { getDataByOneType, summarizeGroupedData } from "./preprocess";
import BarChart from "./Components/BarChart/BarChart";
import CircularBarChartQuadrupled from "./Components/BarChart/CircularBarChartDoubleQuadrupled";
import ViolinChart from "./Components/ViolinChart/ViolinChart";
import ViolinChartKDE from "./Components/ViolinChart/ViolinChart_kde";
import Dropdown from "./Components/Dropdown";
import Button from "./Components/Button";
import ScatterPlot from "./Components/ScatterPlot/ScatterPlot";
import Heatmap from "./Components/Heatmap/Heatmap";
import Card from "./Components/Card/Card";
import CustomBarChart from "./Components/BarChart/CustomBarChart";
import ChordDiagram from "./Components/Circle/ChordDiagram";
import DoubleStackedBarChart from "./Components/BarChart/DoubleStackedBarChart";
import CurvesBarChart from "./Components/BarChart/CurvesBarChart copy";

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

const baseStats = ["defense", "attack", "hp", "height_m", "weight_kg"];

const columnsAgainst = [
  "against_bug",
  "against_dark",
  "against_dragon",
  "against_electric",
  "against_fairy",
  "against_fighting",
  "against_fire",
  "against_flying",
  "against_ghost",
  "against_grass",
  "against_ground",
  "against_ice",
  "against_normal",
  "against_poison",
  "against_psychic",
  "against_rock",
  "against_steel",
  "against_water",
];

class App extends Component {
  constructor(props) {
    super(props);
    this.colorScale = scaleThreshold()
      .domain([5, 100, 500, 999])
      .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"]);
    this.colorScale_type = scaleOrdinal().domain(types).range(schemeSet3);
    this.state = {
      selectedType: "water",
      selectedGeneration: 0, //"all"
      valueDropdownTypeStat: "attack",
      valueDropdownType: "water",
      valueDropdownStatX: "attack",
      valueDropdownStatY: "defense",
      team: [],
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

  handleButtonClick(e) {
    const new_team = [...this.state.team].concat(this.state.selectedName);
    this.setState({ team: new_team });
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

    let dataFilteredByTypeAndGeneration = dataFilteredByType;
    if (this.state.selectedGeneration != 0) {
      dataFilteredByTypeAndGeneration = dataFilteredByType.filter(
        (d) => d.generation == this.state.selectedGeneration
      );
    }
    const dataFilteredByName = data.filter(
      (d) => d.name == this.state.selectedName
    );
    const dataTeam = data.filter((d) => this.state.team.includes(d.name));

    const dataOneType = getDataByOneType(data);
    const dataByTypes = groups(dataOneType, (d) => d.type);
    const summarizedDataByType = summarizeGroupedData(
      dataByTypes,
      columnsAgainst,
      median
    );

    return (
      <div className="App">
        {/* <header className="App-header"></header> */}
        {/* <BarChart
          colorScale={this.colorScale}
          data={data}
          size={[500, 400]}
          yvariable="weight_kg"
        /> */}

        <Heatmap
          data={summarizedDataByType}
          size={[500, 500]}
          vars={columnsAgainst}
          items={summarizedDataByType.map((d) => d.name)}
        />

        <ChordDiagram
          data={dataFlow}
          size={[500, 500]}
          items={types}
          fillScale={this.colorScale_type}
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
          data={dataOneType} //TODO: remove it as it's needed only to calc max ranges
          dataGrouped={dataByTypes}
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
          label="Generation"
          options={range(0, 8).map((t) => ({
            label: t == 0 ? "All" : t,
            value: t,
          }))}
          value={this.state.selectedGeneration}
          onChange={(e) => this.handleDropdownChange(e, "selectedGeneration")}
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
          data={dataFilteredByTypeAndGeneration}
          selectedType={this.state.selectedType}
          size={[600, 600]}
          yvariable={this.state.valueDropdownStatY}
          xvariable={this.state.valueDropdownStatX}
          onClick={this.handlScatterPlotClick}
        />
        <Card data={dataFilteredByName[0]} />
        <Button text="Add to the team" onClick={this.handleButtonClick} />
        {/* <CircularBarChartQuadrupled
          data={dataTeam}
          size={[600, 600]}
          y1variable={"defense"}
          y1innervariable={"attack"}
          y2variable={"sp_defense"}
          y2innervariable={"sp_attack"}
        /> */}

        <DoubleStackedBarChart
          data={dataTeam}
          size={[600, 300]}
          items={this.state.team}
          variables={["hp", "defense"]}
          circlevariables={["hp", "sp_defense"]}
          leftvariable={"attack"}
          circleleftvariable={"sp_attack"}
        />

        <Heatmap
          data={dataTeam}
          size={[800, 300]}
          vars={columnsAgainst}
          items={this.state.team}
        />

        <BarChart
          data={dataTeam}
          size={[600, 300]}
          xvariable={"speed"}
          items={this.state.team}
          text={dataTeam.map((d) => ({
            name: d.name,
            x: d.speed,
            text: `faster than ${format(".0%")(d.speed_rank / data.length)}`,
          }))}
        />

        <CustomBarChart
          data={dataTeam}
          size={[600, 300]}
          xvariable={"weight_kg"}
          yvariable={"height_m"}
          colorvariable={"experience_growth"}
          items={this.state.team}
        />

        <CurvesBarChart
          data={dataTeam}
          size={[600, 300]}
          items={this.state.team}
          leftvariable={"capture_rate"}
          rightvariable={"base_egg_steps"}
          rvariable={"base_happiness"}
        />
      </div>
    );
  }
}

export default App;
