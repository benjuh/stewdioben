import React from "react";
import "./styles/Hints.css";
import Player from "./player";

const Hints = ({ solutions, hintsOpen, hintsSquare, closeHints, showNames }) => {
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) closeHints();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeHints]);

  if (!hintsOpen || hintsSquare === null) return null;

  return (
    <div className="hint-overlay-bg" onClick={closeHints}>
      <div className="hint-overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="hint-overlay-header">
          <span className="hint-overlay-title">Possible Players</span>
          <button className="hint-overlay-close" onClick={closeHints}>✕</button>
        </div>
        <Player
          players={solutions[hintsSquare]}
          changeSquare={() => {}}
          closeModal={closeHints}
          searched={""}
          isHint={!showNames}
          currentSquare={0}
        />
      </div>
    </div>
  );
};

export default Hints;
