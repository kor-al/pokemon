import React, { Component } from "react";
import { range, min } from "d3-array";

import "./SectionExplore.css";

import Dropdown from "../Dropdown";
import Button from "../Button";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import Card from "../Card/Card";
import { formatNameString } from "../../preprocess";

function ExploreHeader(props) {
  let resistance_options = [...props.columnsAgainst];
  resistance_options.push("any");

  return (
    <div className="scatter__header" id="scatter__header">
      <p>
        Show
        <Dropdown
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
          label=""
          options={props.baseStats.map((t) => ({
            label: t,
            value: t,
          }))}
          value={props.valueDropdownStatY}
          onChange={(e) => props.handleDropdownChange(e, "valueDropdownStatY")}
        />
      </p>
      <p>
        <Dropdown
          label="Resistance"
          options={resistance_options.map((t) => ({
            label: formatNameString(t, false),
            value: t,
          }))}
          value={props.selectedResistance}
          onChange={(e) => props.handleDropdownChange(e, "selectedResistance")}
        />
        <Dropdown
          label="Generation"
          options={range(0, 8).map((t) => ({
            label: t === 0 ? "all" : t,
            value: t,
          }))}
          value={props.selectedGeneration}
          onChange={(e) => props.handleDropdownChange(e, "selectedGeneration")}
        />
      </p>
    </div>
  );
}

class SectionExplore extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataFilteredByName = this.props.dataFiltered.filter(
      (d) => d.name === this.props.selectedName
    );

    return (
      <section className="sectionExplore pad">
        <div className="section__header">
          <span className="step">2</span>
          <h2>
            Explore Pokémon of{" "}
            <Dropdown
              className="dropdown--h2"
              label="type"
              options={this.props.types.map((t) => ({ label: t, value: t }))}
              value={this.props.selectedType}
              onChange={(e) =>
                this.props.handleDropdownChange(e, "selectedType")
              }
            />
            and
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
        </div>

        <div className="sectionExplore__graphics">
          {/* <div className="scatter__filters">
            <ExploreHeader {...this.props} />
          </div> */}
          <div className="scatter__wrapper">
            <ExploreHeader {...this.props} />
            <ScatterPlot
              fillScale={this.props.colorScale_type}
              data={this.props.dataFiltered}
              selectedType={this.props.selectedType}
              size={[
                min([600, this.props.size.screenWidth]),
                min([600, this.props.size.screenWidth]),
              ]}
              yvariable={this.props.valueDropdownStatY}
              xvariable={this.props.valueDropdownStatX}
              onClick={this.props.handlScatterPlotClick}
            />
          </div>
          {dataFilteredByName.length === 0 && (
            <div className="explore__helper">
              <p>
                Click on circles and stars to learn more abot pokemons and add
                them to your team
              </p>
              <div className="arrow">
                <img
                  className="arrow__img"
                  alt="arrow pointer"
                  src={process.env.PUBLIC_URL + "/arrows/arrow-left-01.svg"}
                />
              </div>
            </div>
          )}
          {dataFilteredByName.length > 0 && (
            <div className="card__wrapper">
              <div className="card__vspace" />
              <Card data={dataFilteredByName[0]} />
              <Button
                text={
                  <div className={"button__wrapper"}>
                    <span className={"button__icon"}>+</span>
                    <span className={"button__text"}>{"Add to your team"}</span>
                  </div>
                }
                title={"Add to your team"}
                className={"button--cta"}
                onClick={this.props.handleButtonClick}
              />
              <div className="card__warning" id="warning"></div>
            </div>
          )}
        </div>
      </section>
    );
  }
}
export default SectionExplore;
