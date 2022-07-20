import "./App.css";
import "./types.css";
import "./tooltip.css";
import "./arrows.css";
import React, { Component } from "react";
import data from "./pokemons";
// import dataFlow from "./pokemonTypesCounts";
import { scaleOrdinal } from "d3-scale";
import { schemeSet3 } from "d3-scale-chromatic";
import { median, groups } from "d3-array";
import { summarizeGroupedData } from "./preprocess";

import Header from "./Components/Sections/Header";
import SectionTypes from "./Components/Sections/SectionTypes";
import SectionExplore from "./Components/Sections/SectionExplore";
import SectionTeamStats from "./Components/Sections/SectionTeamStats";
import TeamPanel from "./Components/TeamPanel/TeamPanel";
import Footer from "./Components/Sections/Footer";

const MAXTEAMSIZE = 6

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

const baseStats = ["defense", "attack", "hp", "speed", "base_total", "height_m", "weight_kg"];

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
    // this.colorScale = scaleThreshold()
    //   .domain([5, 100, 500, 999])
    //   .range(["#75739F", "#5EAFC6", "#41A368", "#93C464", "#FE9922"]);
    this.state = {
      selectedType: "water",
      selectedTypeSecond: "any",
      selectedResistance: "any",
      selectedGeneration: 0, //"all"
      valueDropdownTypeStat: "attack",
      valueDropdownType: "water",
      valueDropdownStatX: "attack",
      valueDropdownStatY: "defense",
      team: [],
      screenWidth: 1256,
      screenHeight: 1000,
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleViolinClick = this.handleViolinClick.bind(this);
    this.getFilteredDataByType = this.getFilteredDataByType.bind(this);
    this.handlScatterPlotClick = this.handlScatterPlotClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonRemoveClick = this.handleButtonRemoveClick.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    //TODO: replace with hooks?
    window.addEventListener("resize", this.onResize, false);
    this.onResize();
  }

  onResize() {
    this.setState({
      screenWidth: window.innerWidth - 32, //2rem padding
      screenHeight: window.innerHeight,
    });
  }

  handleDropdownChange(e, stateFieldString) {
    this.setState({ [stateFieldString]: e.target.value });
  }

  handleViolinClick(e) {
    this.setState({ selectedType: e.target.__data__[0] });
    document.getElementById("scatter__header").scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
  }

  handlScatterPlotClick(e) {
    this.setState({ selectedName: e.target.dataset.name });
    this.showWarning("")
    // this.setState({ selectedType: e.target.__data__[0] });
  }

  showWarning(text){
    const warningDiv = document.getElementById("warning")
    warningDiv.innerHTML = text
  }

  handleButtonClick(e) {
    //if this pokemon is already in the team
    if (this.state.team.includes(this.state.selectedName)) {
      this.showWarning("You have already added this Pokémon to your team, try another one!")
      return
    }
    //if team is max size
    if (this.state.team.length >= MAXTEAMSIZE){
      this.showWarning(`Your team already has ${MAXTEAMSIZE} members. First, remove a Pokémon from your team then add another one.`)
      return
    }
    //else - add a member
    const new_team = [...this.state.team].concat(this.state.selectedName);
    this.setState({ team: new_team });
  }

  handleButtonRemoveClick(e, d) {
    this.showWarning("")
    const nameToRemove = e.target.parentElement.dataset.name;

    let team = this.state.team;
    this.setState({ team: team.filter((d) => d !== nameToRemove) });

    // const new_team = [...this.state.team].concat(this.state.selectedName);
    // this.setState({ team: new_team });
  }

  getFilteredDataByType(data, filters) {
    let filteredData = data;
    filters.forEach((f) => {
      let filterValue = f.value;
      if (filterValue === "any") return;
      if (filterValue === "no") filterValue = "";
      if (filterValue !== undefined && f.field.length === 2) {
        filteredData = filteredData.filter((d) => {
          return d[f.field[0]] === filterValue || d[f.field[1]] === filterValue;
        });
      }
    });
    return filteredData;
  }

  render() {
    this.colorScale_type = scaleOrdinal().domain(types).range(schemeSet3);

    const dataFilteredByType = this.getFilteredDataByType(data, [
      {
        field: ["type1", "type2"],
        value: this.state.selectedType,
      },
      {
        field: ["type1", "type2"],
        value: this.state.selectedTypeSecond,
      },
    ]);

    let dataFiltered = dataFilteredByType.filter((d) => {
      let condition = true
      if (this.state.selectedGeneration !== 0){
        condition = (d.generation === +this.state.selectedGeneration);
      }
      if (this.state.selectedResistance !== "any") {
        let conditionResist = d[this.state.selectedResistance] < 1; // ||d.resistance[0].includes(this.selectedResistance)
        condition = (condition && conditionResist);
      }
      return condition;
    });

    const dataTeam = data.filter((d) => this.state.team.includes(d.name));

    //For the heatmap:------
    const dataByTypes = groups(
      data.filter((d) => d.type2 === ""),
      (d) => d.type1
    ); //only one-typed pokemons
    const summarizedDataByType = summarizeGroupedData(
      dataByTypes,
      columnsAgainst,
      median
    );

    return (
      <div className="App">
        <Header />
        <SectionTypes
          size={{
            screenWidth: this.state.screenWidth,
            screenHeight: this.state.screenHeight,
          }}
          data={data}
          summarizedDataByType={summarizedDataByType}
          columnsAgainst={columnsAgainst}
          types={types}
          colorScale_type={this.colorScale_type}
          baseStats={baseStats}
          valueDropdownTypeStat={this.state.valueDropdownTypeStat}
          handleDropdownChange={this.handleDropdownChange}
          handleViolinClick={this.handleViolinClick}
        />
        <SectionExplore
          size={{
            screenWidth: this.state.screenWidth,
            screenHeight: this.state.screenHeight,
          }}
          dataFiltered={dataFiltered}
          types={types}
          baseStats={baseStats}
          columnsAgainst={columnsAgainst}
          colorScale_type={this.colorScale_type}
          selectedType={this.state.selectedType}
          selectedTypeSecond={this.state.selectedTypeSecond}
          selectedName={this.state.selectedName}
          selectedGeneration={this.state.selectedGeneration}
          selectedResistance={this.state.selectedResistance}
          valueDropdownStatX={this.state.valueDropdownStatX}
          valueDropdownStatY={this.state.valueDropdownStatY}
          handlScatterPlotClick={this.handlScatterPlotClick}
          handleDropdownChange={this.handleDropdownChange}
          handleButtonClick={this.handleButtonClick}
        />

        <TeamPanel data={dataTeam} onRemove={this.handleButtonRemoveClick} />

        {this.state.team.length > 0 && (
          <SectionTeamStats
            size={{
              screenWidth: this.state.screenWidth,
              screenHeight: this.state.screenHeight,
            }}
            data={data}
            team={this.state.team}
            dataTeam={dataTeam}
            dataRef={summarizedDataByType}
            columnsAgainst={columnsAgainst}
          />
        )}
        <Footer />
      </div>
    );
  }
}

export default App;
