import React from "react";
import "./Footer.css";

function Footer(props) {
  return (
    <footer className="footer pad">
      <div className="footer__text">
        <p>
          Based on the Pokémon dataset provided by {" "}
          <a href="https://onyxdata.co.uk/dataset_challenge/july-2022/">
            the July Onyx DataDNA Challenge.
          </a>
        </p>
        <p>
          Developed and designed by Alisa Korinevskaya. Code available at{" "}
          <a href="https://github.com/kor-al">GitHub</a>.
        </p>
        {/* <p>
          This data visualization is based on the Pokémon dataset provided by{" "}
          <a href="https://onyxdata.co.uk/dataset_challenge/july-2022/">
            the July Onyx DataDNA Challenge.
          </a>
          Developed and designed by Alisa Korinevskaya. Code available at{" "}
          <a href="https://github.com/kor-al">GitHub</a>.
        </p> */}
      </div>
      <img
          alt="Pokeball"
          className="footer__img"
          src={process.env.PUBLIC_URL + "/pokeball-grad-no-shadow-02.svg"}
        />
    </footer>
  );
}

export default Footer;
