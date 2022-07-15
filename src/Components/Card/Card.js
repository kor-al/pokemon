import React, { Component, useRef, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import "./Card.css";

const Meter = ({ label, width, height, maxWidth, value }) => {
  return (
    <div className={"meter"}>
      <span className={"meter__label"}>{label}</span>
      <span
        className="meter__rect meter__rect--bcg"
        style={{ width: maxWidth, height: height }}
      >
        <span
          className={"meter__rect meter__rect--value " + label}
          style={{ width: width, height: height }}
        ></span>
      </span>
      <span className="meter__value">{value}</span>
    </div>
  );
};

class Card extends Component {
  constructor(props) {
    super(props);

    this.weaknesses_img = [];
    this.resistances_img = [];

    this.meterMaxWidth = 180;
    this.meterHeight = 20;

    this.hpScale = scaleLinear()
      .domain([0, 255])
      .range([0, this.meterMaxWidth]);

    this.atkScale = scaleLinear()
      .domain([0, 185])
      .range([0, this.meterMaxWidth]);

    this.defScale = scaleLinear()
      .domain([0, 230])
      .range([0, this.meterMaxWidth]);
  }

  render() {
    if (this.props.data !== undefined) {
      console.log(this.hpScale(this.props.data.hp));

      if (Array.isArray(this.props.data.weakness[0])) {
        this.weaknesses_img = this.props.data.weakness[0];
      } else {
        this.weaknesses_img = this.props.data.weakness;
      }
      if (Array.isArray(this.props.data.resistance[0])) {
        this.resistances_img = this.props.data.resistance[0];
      } else {
        this.resistances_img = this.props.data.resistance;
      }

      this.weaknesses_img = this.weaknesses_img.map((d) => (
        <img
          className="typeIcon"
          src={process.env.PUBLIC_URL + "/types/" + d.slice(8) + ".svg"}
        />
      ));
      this.resistances_img = this.resistances_img.map((d) => (
        <img
          className="typeIcon"
          src={process.env.PUBLIC_URL + "/types/" + d.slice(8) + ".svg"}
        />
      ));
    }

    return (
      <div className={"card " + this.props.data.type1 + "--transparent"}>
        <div className="card__header">
          <div className="card__name">
            <h3>{this.props.data.name}</h3><p>{this.props.data.japanese_name}</p>
          </div>
          <div className="card__types">
            <img
              className="typeIcon"
              src={
                process.env.PUBLIC_URL +
                "/types/" +
                this.props.data.type1 +
                ".svg"
              }
            />
            {this.props.data.type2 != "" && (
              <img
                className="typeIcon"
                src={
                  process.env.PUBLIC_URL +
                  "/types/" +
                  this.props.data.type2 +
                  ".svg"
                }
              />
            )}
          </div>
        </div>
        <img
          className="card__portrait"
          src={
            process.env.PUBLIC_URL +
            "/pokemons/" +
            this.props.data.pokedex_number +
            ".png"
          }
        />
        <div className="card__info">
          <p className="info classification">{this.props.data.classfication}</p>
          <p className="info">HT {this.props.data.height_m}m</p>
          <p className="info">WT {this.props.data.weight_kg}kg</p>
        </div>
        <div className="card__meters">
          <Meter
            label={"HP"}
            height={this.meterHeight + "px"}
            width={this.hpScale(this.props.data.hp) + "px"}
            maxWidth={this.meterMaxWidth + "px"}
            value={this.props.data.hp}
          />
          <Meter
            label={"Attack"}
            height={this.meterHeight + "px"}
            width={this.atkScale(this.props.data.attack) + "px"}
            maxWidth={this.meterMaxWidth + "px"}
            value={this.props.data.attack}
          />
          <Meter
            label={"Defense"}
            height={this.meterHeight + "px"}
            width={this.defScale(this.props.data.defense) + "px"}
            maxWidth={this.meterMaxWidth + "px"}
            value={this.props.data.defense}
          />
        </div>
        <div className="card__weakness">
          <span className={"card__label"}>Weakness</span>
          <div className="weakness__wrapper">
          {this.weaknesses_img}
          </div>
        </div>
        <div className="card__resistance">
          <span className={"card__label"}>Resistance</span>
          <div className="resistance__wrapper">
          {this.resistances_img}
          </div>
        </div>
      </div>
    );
  }
}
export default Card;
