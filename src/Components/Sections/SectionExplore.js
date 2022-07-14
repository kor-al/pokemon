import React, { Component } from "react";
import { range } from "d3-array";

import "./SectionExplore.css";

import Dropdown from "../Dropdown";
import Button from "../Button";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import Card from "../Card/Card";

class SectionExplore extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataFilteredByName = this.props.dataFiltered.filter(
      (d) => d.name == this.props.selectedName
    );

    return (
      <section className="sectionExplore pad">
        <h2><span className="step">2</span>Explore pokemons</h2>
        <div className="sectionExplore__graphics">
          <div className="scatter__wrapper">
            <Dropdown
              label="Type"
              options={this.props.types.map((t) => ({ label: t, value: t }))}
              value={this.props.selectedType}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "selectedType")
              }
            />
            <Dropdown
              label="Generation"
              options={range(0, 8).map((t) => ({
                label: t == 0 ? "All" : t,
                value: t,
              }))}
              value={this.props.selectedGeneration}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "selectedGeneration")
              }
            />
            <Dropdown
              label="Stat X"
              options={this.props.baseStats.map((t) => ({
                label: t,
                value: t,
              }))}
              value={this.props.valueDropdownStatX}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "valueDropdownStatX")
              }
            />
            <Dropdown
              label="Stat Y"
              options={this.props.baseStats.map((t) => ({
                label: t,
                value: t,
              }))}
              value={this.props.valueDropdownStatY}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "valueDropdownStatY")
              }
            />
            <ScatterPlot
              fillScale={this.props.colorScale_type}
              data={this.props.dataFiltered}
              selectedType={this.props.selectedType}
              size={[600, 600]}
              yvariable={this.props.valueDropdownStatY}
              xvariable={this.props.valueDropdownStatX}
              onClick={this.props.handlScatterPlotClick}
            />
          </div>
          {dataFilteredByName.length > 0 && (
            <div className="card__wrapper">
              <Card data={dataFilteredByName[0]} />
              <Button
                text="Add to the team"
                onClick={this.props.handleButtonClick}
              />
            </div>
          )}
        </div>
      </section>
    );
  }
}
export default SectionExplore;
