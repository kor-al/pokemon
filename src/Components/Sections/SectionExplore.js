import React, { Component } from "react";
import { range } from "d3-array";

import "./SectionExplore.css";

import Dropdown from "../Dropdown";
import Button from "../Button";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import Card from "../Card/Card";

function ExploreHeader(props) {
  return (
    <div className="scatter__header">
      <p>
      Show pokemons'
      <Dropdown
        className="dropdown--inline"
        label=""
        options={props.baseStats.map((t) => ({
          label: t,
          value: t,
        }))}
        value={props.valueDropdownStatX}
        onChange={(e) => props.handleDropdownChange(e, "valueDropdownStatX")}
      />
      vs
      <Dropdown
        className="dropdown--inline"
        label=""
        options={props.baseStats.map((t) => ({
          label: t,
          value: t,
        }))}
        value={props.valueDropdownStatY}
        onChange={(e) => props.handleDropdownChange(e, "valueDropdownStatY")}
      />
      </p>
            <Dropdown
        className="dropdown--inline"
        label="Generation"
        options={range(0, 8).map((t) => ({
          label: t == 0 ? "All" : t,
          value: t,
        }))}
        value={props.selectedGeneration}
        onChange={(e) => props.handleDropdownChange(e, "selectedGeneration")}
      />
    </div>
  );
}

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
        <h2>
          <span className="step">2</span>Explore pokemons of{" "}
          <Dropdown
            className="dropdown--h2"
            label="type"
            options={this.props.types.map((t) => ({ label: t, value: t }))}
            value={this.props.selectedType}
            onChange={(e) => this.props.handleDropdownChange(e, "selectedType")}
          />
          and{" "}
          <Dropdown
            className="dropdown--h2"
            label=""
            options={["any", "no"]
              .concat(this.props.types)
              .filter((v) => v !== this.props.selectedType)
              .map((t) => ({ label: t, value: t }))}
            value={this.props.selectedTypeSecond}
            onChange={(e) =>
              this.props.handleDropdownChange(e, "selectedTypeSecond")
            }
          />
          second type
        </h2>
        <div className="sectionExplore__graphics">
          <div className="scatter__wrapper">
            <ExploreHeader {...this.props} />
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
              {/* <div className="card__vspace"/> */}
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
