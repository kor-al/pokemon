import React, { Component, useRef, useEffect } from "react";
import Button from "../Button";
import "./TeamPanel.css";
// import "./Card.css"

const Member = ({ data, onremove }) => {
  return (
    <div className="member" data-name={data.name}>
      <div
        className={"member__background " + data.type1 + "--transparent"}
      />
      <img
        className="member__image"
        src={process.env.PUBLIC_URL + "/pokemons/" + data.pokedex_number + ".png"}
      />
      <div className="member__info">{data.name}</div>
      <div className="member__type">
        <img
          className="member__typeIcon"
          src={process.env.PUBLIC_URL + "/types/" + data.type1 + ".svg"}
        />
        {data.type2 !== "" && (
          <img
            className="member__typeIcon"
            src={process.env.PUBLIC_URL + "/types/" + data.type2 + ".svg"}
          />
        )}
      </div>
      <Button
        className="member__button"
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
        {this.props.data.map((d) => (
          <li className="team__item">
            <Member data={d} onremove={this.props.onRemove} />
          </li>
        ))}{" "}
      </ul>
    );

    return (
      <section className="team pad">
        <h2>
          <span className="step">3</span>Build a team
        </h2>
        {this.props.data.length == 0 && (
          <p>Add up to 6 pokemons to your team with the plot above!</p>
        )}
        {this.props.data.length > 0 && cards}
      </section>
    );
  }
}
export default TeamPanel;
