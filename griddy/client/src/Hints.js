import React from "react";
import "./styles/Hints.css";
import Player from "./player";

const Hints = ({ solutionsPerSquare, solutions, gameMode, gridContent }) => {
  const [hintsOpen, setHintsOpen] = React.useState(false);
  const [square, setSquare] = React.useState(null);

  // on escape press, close hints
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeHints();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const openHints = (square) => {
    setHintsOpen(true);
    console.log("OPENED");
    setSquare(square);
  };

  const closeHints = () => {
    setHintsOpen(false);
    setSquare(null);
  };

  const HintScreen = () => {
    if (!hintsOpen) return;
    return (
      <div className="background">
        <div className="players-container">
          <div style={{ height: "150px" }}></div>
          <Player
            players={solutions[square]}
            changeSquare={() => {}}
            closeModal={closeHints}
            searched={""}
            isHint={true}
            currentSquare={0}
          />
        </div>
      </div>
    );
  };

  // breakout early cases
  if (solutionsPerSquare.includes(0)) return;
  if (gameMode == "hard") return;

  return (
    <div>
      <HintScreen />
      <div className="hints-container">
        {!gridContent[0] ? (
          <div className="hint-box" onClick={() => openHints(0)}>
            Square 1 Hint
          </div>
        ) : null}
        {!gridContent[1] ? (
          <div className="hint-box" onClick={() => openHints(1)}>
            Square 2 Hint
          </div>
        ) : null}
        {!gridContent[2] ? (
          <div className="hint-box" onClick={() => openHints(2)}>
            Square 3 Hint
          </div>
        ) : null}
        {!gridContent[3] ? (
          <div className="hint-box" onClick={() => openHints(3)}>
            Square 4 Hint
          </div>
        ) : null}
        {!gridContent[4] ? (
          <div className="hint-box" onClick={() => openHints(4)}>
            Square 5 Hint
          </div>
        ) : null}
        {!gridContent[5] ? (
          <div className="hint-box" onClick={() => openHints(5)}>
            Square 6 Hint
          </div>
        ) : null}
        {!gridContent[6] ? (
          <div className="hint-box" onClick={() => openHints(6)}>
            Square 7 Hint
          </div>
        ) : null}
        {!gridContent[7] ? (
          <div className="hint-box" onClick={() => openHints(7)}>
            Square 8 Hint
          </div>
        ) : null}
        {!gridContent[8] ? (
          <div className="hint-box" onClick={() => openHints(8)}>
            Square 9 Hint
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Hints;
