import React, { useEffect } from "react";
import "./styles/Grid.css";
import Player from "./player";
import defaults from "./defaults";

import Alabama from "./assets/COLLEGE_TEAMS/Alabama.png";
import Pittsburgh from "./assets/COLLEGE_TEAMS/Pittsburgh.png";
import Wisconsin from "./assets/COLLEGE_TEAMS/Wisconsin.png";
import Nebraska from "./assets/COLLEGE_TEAMS/Nebraska.png";
import Clemson from "./assets/COLLEGE_TEAMS/Clemson.png";
import Tennessee from "./assets/COLLEGE_TEAMS/Tennessee.png";
import NotreDame from "./assets/COLLEGE_TEAMS/NotreDame.png";
import FloridaState from "./assets/COLLEGE_TEAMS/FloridaState.png";
import Michigan from "./assets/COLLEGE_TEAMS/Michigan.png";
import TexasAM from "./assets/COLLEGE_TEAMS/TexasA&M.png";
import Texas from "./assets/COLLEGE_TEAMS/Texas.png";
import PennState from "./assets/COLLEGE_TEAMS/PennState.png";
import Auburn from "./assets/COLLEGE_TEAMS/Auburn.png";
import MichiganState from "./assets/COLLEGE_TEAMS/MichiganState.png";
import LouisianaState from "./assets/COLLEGE_TEAMS/LouisianaState.png";
import OhioState from "./assets/COLLEGE_TEAMS/OhioState.png";
import Georgia from "./assets/COLLEGE_TEAMS/Georgia.png";
import Oregon from "./assets/COLLEGE_TEAMS/Oregon.png";
import SouthernCalifornia from "./assets/COLLEGE_TEAMS/SouthernCalifornia.png";
import Stanford from "./assets/COLLEGE_TEAMS/Stanford.png";
import Miami from "./assets/COLLEGE_TEAMS/Miami.png";
import California from "./assets/COLLEGE_TEAMS/California.png";
import Washington from "./assets/COLLEGE_TEAMS/Washington.png";
import NorthCarolina from "./assets/COLLEGE_TEAMS/NorthCarolina.png";
import UCLA from "./assets/COLLEGE_TEAMS/UCLA.png";
import ArizonaState from "./assets/COLLEGE_TEAMS/ArizonaState.png";
import Iowa from "./assets/COLLEGE_TEAMS/Iowa.png";
import Florida from "./assets/COLLEGE_TEAMS/Florida.png";
import Oklahoma from "./assets/COLLEGE_TEAMS/Oklahoma.png";

import ARI from "./assets/NFL_TEAMS/ARI.png";
import ATL from "./assets/NFL_TEAMS/ATL.png";
import BAL from "./assets/NFL_TEAMS/BAL.png";
import BUF from "./assets/NFL_TEAMS/BUF.png";
import CAR from "./assets/NFL_TEAMS/CAR.png";
import CHI from "./assets/NFL_TEAMS/CHI.png";
import CIN from "./assets/NFL_TEAMS/CIN.png";
import CLE from "./assets/NFL_TEAMS/CLE.png";
import DAL from "./assets/NFL_TEAMS/DAL.png";
import DEN from "./assets/NFL_TEAMS/DEN.png";
import DET from "./assets/NFL_TEAMS/DET.png";
import GB from "./assets/NFL_TEAMS/GB.png";
import HOU from "./assets/NFL_TEAMS/HOU.png";
import IND from "./assets/NFL_TEAMS/IND.png";
import JAX from "./assets/NFL_TEAMS/JAX.png";
import KC from "./assets/NFL_TEAMS/KC.png";
import LAC from "./assets/NFL_TEAMS/LAC.png";
import LA from "./assets/NFL_TEAMS/LA.png";
import LV from "./assets/NFL_TEAMS/LV.png";
import MIA from "./assets/NFL_TEAMS/MIA.png";
import MIN from "./assets/NFL_TEAMS/MIN.png";
import NE from "./assets/NFL_TEAMS/NE.png";
import NO from "./assets/NFL_TEAMS/NO.png";
import NYG from "./assets/NFL_TEAMS/NYG.png";
import NYJ from "./assets/NFL_TEAMS/NYJ.png";
import PHI from "./assets/NFL_TEAMS/PHI.png";
import PIT from "./assets/NFL_TEAMS/PIT.png";
import SEA from "./assets/NFL_TEAMS/SEA.png";
import SF from "./assets/NFL_TEAMS/SF.png";
import TB from "./assets/NFL_TEAMS/TB.png";
import TEN from "./assets/NFL_TEAMS/TEN.png";
import WAS from "./assets/NFL_TEAMS/WAS.png";
import Hints from "./Hints";
import Timer from "./Timer";

function Grid({ players }) {
  useEffect(() => {
    if (!players) {
      return;
    }
    generateParameters();
  }, [players]);

  const MININUM_SOLUTIONS = 10;

  const CORRECT = defaults.COLORS.CORRECT;
  const INCORRECT = defaults.COLORS.INCORRECT;
  const [isOpen, setModalOpen] = React.useState(false);
  const [gridContent, setGridContent] = React.useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [currentSquare, setCurrentSquare] = React.useState(0);
  const [hintsOpen, setHintsOpen] = React.useState(false);
  const [hintsSquare, setHintsSquare] = React.useState(null);
  const [hintsShowNames, setHintsShowNames] = React.useState(false);
  const [hintsUsedSet, setHintsUsedSet] = React.useState(new Set());
  const startTimeRef = React.useRef(Date.now());
  const [winTime, setWinTime] = React.useState(null);
  const [gaveUp, setGaveUp] = React.useState(false);
  const openHintsSquare = (n, showNames = false) => {
    setHintsOpen(true);
    setHintsSquare(n);
    setHintsShowNames(showNames);
    if (!showNames) setHintsUsedSet(prev => new Set([...prev, n]));
  };
  const closeHints = () => { setHintsOpen(false); setHintsSquare(null); setHintsShowNames(false); };

  const [search, setSearch] = React.useState("");
  const [parameters, setParameters] = React.useState([
    { is_image: false, content: "" },
    { is_image: false, content: "" },
    { is_image: false, content: "" },
    { is_image: false, content: "" },
    { is_image: false, content: "" },
    { is_image: false, content: "" },
  ]);

  const openModal = (num) => {
    setModalOpen(true);
    setCurrentSquare(num);
  };

  const WinScreen = () => {
    if (winTime === null) return null;
    const mins = Math.floor(winTime / 60);
    const secs = winTime % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    const uniquePlayers = new Set(
      gridContent.filter(c => c && !c.gaveUp).map(c => c.name)
    ).size;
    return (
      <div className="win-modal">
        <div className="win-modal-inner">
          <h1>Congratulations!</h1>
          <div className="win-stats">
            <div className="win-stat">
              <span className="win-stat-label">Time</span>
              <span className="win-stat-value">{timeStr}</span>
            </div>
            <div className="win-stat">
              <span className="win-stat-label">Hints Used</span>
              <span className="win-stat-value">{hintsUsedSet.size}</span>
            </div>
            <div className="win-stat">
              <span className="win-stat-label">Unique Players</span>
              <span className="win-stat-value">{uniquePlayers}</span>
            </div>
          </div>
          <button className="play-again-btn" onClick={() => window.location.reload()}>Play Again</button>
        </div>
      </div>
    );
  };

  const [gameMode, setGameMode] = React.useState("easy");
  const GameMode = () => {
    return (
      <div className="game-mode">
        <div className="game-mode-buttons">
          <div
            className={`game-button ${
              gameMode === "easy" ? "selected" : "default"
            }`}
            onClick={() => setGameMode("easy")}
          >
            Easy
          </div>
          <div
            className={`game-button ${
              gameMode === "hard" ? "selected" : "default"
            }`}
            onClick={() => setGameMode("hard")}
          >
            Hard
          </div>
        </div>
      </div>
    );
  };

  const changeSquare = (player, square) => {
    let new_grid = [...gridContent];

    if (checkIfSelectionIsCorrect(player, square)) {
      new_grid[square - 1] = player;
      console.log("CORRECT");
      setSearch("");
    } else {
      new_grid[square - 1] = null;
      console.log("INCORRECT");
      setSearch("");
    }
    setGridContent(new_grid);
  };

  const checkIfSelectionIsCorrect = (player, square) => {
    console.log(solutions[square - 1]);
    if (solutions[square - 1].includes(player)) {
      return true;
    }
    return false;
  };

  const closeModal = () => {
    setModalOpen(false);
    setSearch("");
  };

  const handler = (e) => {
    if (e.isComposing || e.keyCode === 27) {
      closeModal();
      setSearch("");
    }
  };

  const generateParameters = () => {
    (async () => {
    for (let _attempt = 0; _attempt < 2000; _attempt++) {
      if (_attempt > 0 && _attempt % 50 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    const params = [];
    let teams = 4;
    let positions = 1;
    let colleges = 1;
    // get 4 random indexes
    const teamIndexes = new Set();
    while (teamIndexes.size < teams) {
      let index = Math.floor(Math.random() * defaults.NFL_TEAMS.length);
      teamIndexes.add(index);
    }

    // get 1 random index for positions
    const positionIndexes = new Set();
    while (positionIndexes.size < positions) {
      let index = Math.floor(Math.random() * defaults.POSITIONS.length);
      const allowed = new Set(['WR', 'RB', 'QB', 'DB', 'TE']);
      if (!allowed.has(defaults.POSITIONS[index])) {
        continue;
      }
      positionIndexes.add(index);
    }

    // get 1 random index for colleges
    const collegeIndexes = new Set();
    while (collegeIndexes.size < colleges) {
      let index = Math.floor(Math.random() * defaults.COLLEGES.length);
      collegeIndexes.add(index);
    }

    for (let index of teamIndexes) {
      let str = defaults.NFL_TEAMS[index];
      let content;
      switch (str) {
        case "ARI":
          content = ARI;
          break;
        case "ATL":
          content = ATL;
          break;
        case "BAL":
          content = BAL;
          break;
        case "BUF":
          content = BUF;
          break;
        case "CAR":
          content = CAR;
          break;
        case "CHI":
          content = CHI;
          break;
        case "CIN":
          content = CIN;
          break;
        case "CLE":
          content = CLE;
          break;
        case "DAL":
          content = DAL;
          break;
        case "DEN":
          content = DEN;
          break;
        case "DET":
          content = DET;
          break;
        case "GB":
          content = GB;
          break;
        case "HOU":
          content = HOU;
          break;
        case "IND":
          content = IND;
          break;
        case "JAX":
          content = JAX;
          break;
        case "KC":
          content = KC;
          break;
        case "LAC":
          content = LAC;
          break;
        case "LA":
          content = LA;
          break;
        case "LV":
          content = LV;
          break;
        case "MIA":
          content = MIA;
          break;
        case "MIN":
          content = MIN;
          break;
        case "NE":
          content = NE;
          break;
        case "NO":
          content = NO;
          break;
        case "NYG":
          content = NYG;
          break;
        case "NYJ":
          content = NYJ;
          break;
        case "PHI":
          content = PHI;
          break;
        case "PIT":
          content = PIT;
          break;
        case "SEA":
          content = SEA;
          break;
        case "SF":
          content = SF;
          break;
        case "TB":
          content = TB;
          break;
        case "TEN":
          content = TEN;
          break;
        case "WAS":
          content = WAS;
          break;
        default:
          break;
      }

      params.push({
        is_image: true,
        team: defaults.NFL_TEAMS[index],
        content: content,
        paramType: "teams",
      });
    }

    for (let index of positionIndexes) {
      params.push({
        is_image: false,
        content: defaults.POSITIONS[index],
        paramType: "position",
      });
    }

    for (let index of collegeIndexes) {
      let str = defaults.COLLEGES[index];
      let content;
      switch (str) {
        case "Alabama":
          content = Alabama;
          break;
        case "Pittsburgh":
          content = Pittsburgh;
          break;
        case "Wisconsin":
          content = Wisconsin;
          break;
        case "Nebraska":
          content = Nebraska;
          break;
        case "Clemson":
          content = Clemson;
          break;
        case "Tennessee":
          content = Tennessee;
          break;
        case "Notre Dame":
          content = NotreDame;
          break;
        case "Florida State":
          content = FloridaState;
          break;
        case "Michigan":
          content = Michigan;
          break;
        case "Texas A&M":
          content = TexasAM;
          break;
        case "Texas":
          content = Texas;
          break;
        case "Penn State":
          content = PennState;
          break;
        case "Auburn":
          content = Auburn;
          break;
        case "Michigan State":
          content = MichiganState;
          break;
        case "Louisiana State":
          content = LouisianaState;
          break;
        case "Ohio State":
          content = OhioState;
          break;
        case "Georgia":
          content = Georgia;
          break;
        case "Oregon":
          content = Oregon;
          break;
        case "Southern California":
          content = SouthernCalifornia;
          break;
        case "Stanford":
          content = Stanford;
          break;
        case "Miami":
          content = Miami;
          break;
        case "California":
          content = California;
          break;
        case "Washington":
          content = Washington;
          break;
        case "North Carolina":
          content = NorthCarolina;
          break;
        case "UCLA":
          content = UCLA;
          break;
        case "Arizona State":
          content = ArizonaState;
          break;
        case "Iowa":
          content = Iowa;
          break;
        case "Florida":
          content = Florida;
          break;
        case "Oklahoma":
          content = Oklahoma;
          break;
        default:
          break;
      }

      params.push({
        is_image: true,
        team: defaults.COLLEGES[index],
        content: content,
        paramType: "college",
      });
    }
    // Separate teams from non-teams. Keep 3 teams on the top axis (params[0-2])
    // and 1 team + position + college on the side axis (params[3-5]).
    // This prevents a position×college intersection, which is too sparse to satisfy.
    const teamParams = params.filter(p => p.paramType === 'teams');
    const nonTeamParams = params.filter(p => p.paramType !== 'teams');
    teamParams.sort(() => Math.random() - 0.5);
    nonTeamParams.sort(() => Math.random() - 0.5);
    const orderedParams = [
      teamParams[0], teamParams[1], teamParams[2],
      teamParams[3], nonTeamParams[0], nonTeamParams[1],
    ];
    if (canSolveGriddy(orderedParams)) {
      setParameters(orderedParams);
      return;
    }
    } // end for loop
    })();
  };

  const [solutionsPerSquare, setSolutionsPerSquare] = React.useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [solutions, setSolutions] = React.useState([]);

  const giveUpGame = () => {
    const newGrid = gridContent.map(c => c === null ? { gaveUp: true } : c);
    setGaveUp(true);
    setGridContent(newGrid);
  };

  const handleTileClick = (squareNum) => {
    const idx = squareNum - 1;
    if (gridContent[idx]?.gaveUp) {
      openHintsSquare(idx, true);
    } else {
      openModal(squareNum);
    }
  };

  const solveSquare = (player, param1, param2) => {
    if (param1.paramType === "teams" && param2.paramType === "teams") {
      if (
        player.teams.includes(param1.team) &&
        player.teams.includes(param2.team)
      ) {
        return true;
      }
    } else if (param1.paramType === "teams" && param2.paramType === "college") {
      if (
        player.teams.includes(param1.team) &&
        player.college === param2.team
      ) {
        return true;
      }
    } else if (
      param1.paramType === "teams" &&
      param2.paramType === "position"
    ) {
      if (
        player.teams.includes(param1.team) &&
        player.position.toString() === param2.content
      ) {
        return true;
      }
    } else if (param1.paramType === "college" && param2.paramType === "teams") {
      if (
        player.teams.includes(param2.team) &&
        player.college === param1.team
      ) {
        return true;
      }
    } else if (
      param1.paramType === "college" &&
      param2.paramType === "position"
    ) {
      if (
        player.college === param1.team &&
        player.position.toString() === param2.content
      ) {
        return true;
      }
    } else if (
      param1.paramType === "position" &&
      param2.paramType === "teams"
    ) {
      if (
        player.teams.includes(param2.team) &&
        player.position.toString() === param1.content
      ) {
        return true;
      }
    } else if (
      param1.paramType === "position" &&
      param2.paramType === "college"
    ) {
      if (
        player.college === param2.team &&
        player.position === param1.content.toString()
      ) {
        return true;
      }
    }

    return false;
  };

  const canSolveGriddy = (parameters) => {
    const temp = [];
    const sps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sq1 = [];
    const sq2 = [];
    const sq3 = [];
    const sq4 = [];
    const sq5 = [];
    const sq6 = [];
    const sq7 = [];
    const sq8 = [];
    const sq9 = [];
    players.forEach((player) => {
      // param 1 and 4
      if (solveSquare(player, parameters[0], parameters[3])) {
        sq1.push(player);
        sps[0]++;
      }

      // param 2 and 4
      if (solveSquare(player, parameters[1], parameters[3])) {
        sq2.push(player);
        sps[1]++;
      }

      // param 3 and 4
      if (solveSquare(player, parameters[2], parameters[3])) {
        sq3.push(player);
        sps[2]++;
      }

      // param 1 and 5
      if (solveSquare(player, parameters[0], parameters[4])) {
        sq4.push(player);
        sps[3]++;
      }

      // param 2 and 5
      if (solveSquare(player, parameters[1], parameters[4])) {
        sq5.push(player);
        sps[4]++;
      }

      // param 3 and 5
      if (solveSquare(player, parameters[2], parameters[4])) {
        sq6.push(player);
        sps[5]++;
      }

      // param 1 and 6
      if (solveSquare(player, parameters[0], parameters[5])) {
        sq7.push(player);
        sps[6]++;
      }

      // param 2 and 6
      if (solveSquare(player, parameters[1], parameters[5])) {
        sq8.push(player);
        sps[7]++;
      }

      // param 3 and 6
      if (solveSquare(player, parameters[2], parameters[5])) {
        sq9.push(player);
        sps[8]++;
      }
    });

    for (let i = 0; i < sps.length; i++) {
      if (sps[i] < MININUM_SOLUTIONS) {
        return false;
      }
    }
    // sort each based on last year played
    temp.push(sq1.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq2.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq3.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq4.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq5.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq6.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq7.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq8.sort((a, b) => b.years_played[1] - a.years_played[1]));
    temp.push(sq9.sort((a, b) => b.years_played[1] - a.years_played[1]));
    setSolutionsPerSquare(sps);
    setSolutions(temp);
    return true;
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handler, false);
    return () => window.removeEventListener("keydown", handler, false);
  }, []);

  React.useEffect(() => {
    if (
      solutions.length > 0 &&
      winTime === null &&
      gridContent.every(c => c !== null && !c?.gaveUp)
    ) {
      setWinTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
  }, [gridContent]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const isLoading = !players || solutionsPerSquare.every(n => n === 0);

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Setting up game…</p>
        </div>
      )}
      <WinScreen />
      <div className="griddy-header">
        <a href="/" className="hub-back">← Hub</a>
        <h1 className="griddy-title">GRIDDY</h1>
        <Timer stopped={winTime !== null} />
      </div>
      <Hints
        solutions={solutions}
        hintsOpen={hintsOpen}
        hintsSquare={hintsSquare}
        closeHints={closeHints}
        showNames={hintsShowNames}
      />
      <GameMode />
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-container">
              <input
                type="text"
                placeholder=""
                className="searchbar"
                id="search"
                autoFocus={true}
                onChange={handleChange}
                value={search}
              />
            </div>
            <Player
              players={players}
              searched={search}
              currentSquare={currentSquare}
              changeSquare={changeSquare}
              closeModal={closeModal}
            />
          </div>
        </div>
      )}
      <div className="grid-container">
        <div className="grid-item" id="blank"></div>
        <div className="grid-item param" id="param1">
          {!parameters[0].is_image ? (
            <h1>{parameters[0].content}</h1>
          ) : (
            <img src={parameters[0].content} alt={parameters[0].team} />
          )}
        </div>
        <div className="grid-item param" id="param2">
          {!parameters[1].is_image ? (
            <h1>{parameters[1].content}</h1>
          ) : (
            <img src={parameters[1].content} alt={parameters[1].team} />
          )}
        </div>
        <div className="grid-item param" id="param3">
          {!parameters[2].is_image ? (
            <h1>{parameters[2].content}</h1>
          ) : (
            <img src={parameters[2].content} alt={parameters[2].team} />
          )}
        </div>
        <div className="grid-item param" id="param4">
          {!parameters[3].is_image ? (
            <h1>{parameters[3].content}</h1>
          ) : (
            <img src={parameters[3].content} alt={parameters[3].team} />
          )}
        </div>
        <div
          style={gridContent[0] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(1)}
        >
          <h1>{solutionsPerSquare[0]}</h1>
          {!gridContent[0] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(0); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[1] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(2)}
        >
          <h1>{solutionsPerSquare[1]}</h1>
          {!gridContent[1] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(1); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[2] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(3)}
        >
          <h1>{solutionsPerSquare[2]}</h1>
          {!gridContent[2] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(2); }}>?</button>
          )}
        </div>
        <div className="grid-item param" id="param5">
          {!parameters[4].is_image ? (
            <h1>{parameters[4].content}</h1>
          ) : (
            <img src={parameters[4].content} alt={parameters[4].team} />
          )}
        </div>
        <div
          style={gridContent[3] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(4)}
        >
          <h1>{solutionsPerSquare[3]}</h1>
          {!gridContent[3] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(3); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[4] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(5)}
        >
          <h1>{solutionsPerSquare[4]}</h1>
          {!gridContent[4] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(4); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[5] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(6)}
        >
          <h1>{solutionsPerSquare[5]}</h1>
          {!gridContent[5] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(5); }}>?</button>
          )}
        </div>
        <div className="grid-item param" id="param6">
          {!parameters[5].is_image ? (
            <h1>{parameters[5].content}</h1>
          ) : (
            <img src={parameters[5].content} alt={parameters[5].team} />
          )}
        </div>
        <div
          style={gridContent[6] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(7)}
        >
          <h1>{solutionsPerSquare[6]}</h1>
          {!gridContent[6] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(6); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[7] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(8)}
        >
          <h1>{solutionsPerSquare[7]}</h1>
          {!gridContent[7] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(7); }}>?</button>
          )}
        </div>
        <div
          style={gridContent[8] ? { backgroundColor: CORRECT } : { backgroundColor: INCORRECT }}
          className="grid-item clickable"
          onClick={() => handleTileClick(9)}
        >
          <h1>{solutionsPerSquare[8]}</h1>
          {!gridContent[8] && !solutionsPerSquare.includes(0) && gameMode !== "hard" && (
            <button className="hint-btn" onClick={(e) => { e.stopPropagation(); openHintsSquare(8); }}>?</button>
          )}
        </div>
      </div>
      <div className="hints-used-display">Hints Used: {hintsUsedSet.size}</div>
      <div className="game-actions">
        {!gaveUp && winTime === null && (
          <button className="action-btn give-up-btn" onClick={giveUpGame}>Give Up</button>
        )}
        <button className="action-btn play-again-btn-inline" onClick={() => window.location.reload()}>Play Again</button>
      </div>
    </div>
  );
}

export default Grid;
