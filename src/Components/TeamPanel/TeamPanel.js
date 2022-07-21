import React, { Component, useRef, useEffect } from "react";
import Button from "../Button";
import "./TeamPanel.css";
// import "./Card.css"

const Member = ({ data, i, onremove }) => {
  return (
    <div className="member" key={"member" + i} data-name={data.name}>
      <div
        className={"member__background " + data.type1 + "--transparent"}
        key={"member__background" + i}
      />
      <img
        key={"member__image" + i}
        className="member__image"
        alt={data.name}
        src={
          process.env.PUBLIC_URL + "/pokemons/" + data.pokedex_number + ".png"
        }
      />
      <div className="member__info" key={"member__info" + i}>
        {data.name}
      </div>
      <div className="member__type">
        <img
          key={"member__type1Icon" + i}
          alt={data.type1}
          title={data.type1}
          className="member__typeIcon"
          src={process.env.PUBLIC_URL + "/types/" + data.type1 + ".svg"}
        />
        {data.type2 !== "" && (
          <img
            key={"member__type2Icon" + i}
            alt={data.type2}
            title={data.type2}
            className="member__typeIcon"
            src={process.env.PUBLIC_URL + "/types/" + data.type2 + ".svg"}
          />
        )}
      </div>
      <Button
        key={"button" + i}
        className="member__button"
        title={"Remove from your team"}
        text="X"
        onClick={(e, d) => onremove(e, d)}
      />
    </div>
  );
};

class TeamPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cards = (
      <ul className="team__list">
        {this.props.data.map((d, i) => (
          <li className="team__item" key={"team__item"+i}>
            <Member data={d} i={i} onremove={this.props.onRemove} />
          </li>
        ))}{" "}
      </ul>
    );

    return (
      <section className="team pad">
        <div className="section__header">
          <span className="step">3</span>
          <h2>Build your Pokémon team</h2>
        </div>
        {this.props.data.length === 0 && (
          <p>Add up to 6 Pokémon to your team with the plot above!</p>
        )}
        {this.props.data.length > 0 && cards}
      </section>
    );
  }
}
export default TeamPanel;
