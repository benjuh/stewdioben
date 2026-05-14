import React from "react";
import "./styles/Player.css";

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


function Player({
  players,
  searched,
  currentSquare,
  changeSquare,
  closeModal,
  isHint,
  revealNames,
}) {
  const MAX_PLAYERS = 100;

  const randomPlayers = React.useMemo(() => {
    if (!players || players.length === 0) return [];
    const getRandomInt = (max) => Math.floor(Math.random() * max);
    const indexesUsed = new Set();
    const result = [];
    const cap = Math.min(MAX_PLAYERS, players.length);
    while (result.length < cap) {
      let idx = getRandomInt(players.length);
      while (indexesUsed.has(idx)) idx = getRandomInt(players.length);
      indexesUsed.add(idx);
      result.push(players[idx]);
    }
    return result;
  }, [players]);

  const matchedPlayers = React.useMemo(() => {
    if (!players || players.length === 0) return [];
    if (searched === "" && !isHint) return randomPlayers;
    const normalize = (s) => s.toLowerCase().replace(/[-']/g, '');
    const q = normalize(searched);
    const queryTokens = q.split(/\s+/).filter(Boolean);
    const result = players.filter((player) => {
      if (queryTokens.length === 0) return true;
      const nameTokens = normalize(player.name).split(/\s+/);
      return queryTokens.every(qt => nameTokens.some(nt => nt.startsWith(qt)));
    });
    const rank = (name) => {
      const n = normalize(name);
      if (n === q) return 0;
      if (n.startsWith(q)) return 1;
      const nameTokens = n.split(/\s+/);
      if (queryTokens.every(qt => nameTokens.some(nt => nt.startsWith(qt)))) return 2;
      return 3;
    };
    result.sort((a, b) => rank(a.name) - rank(b.name));
    return result;
  }, [searched, players, isHint, randomPlayers]);


  const generateLogos = (player) => {
    let teams = player.teams;
    let team_logos = [];
    let col;
    let content;
    for (let team of teams) {
      switch (team) {
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
      team_logos.push(content);
    }

    var college = player.college;
    switch (college) {
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
        content = "";
        break;
    }
    col = content;

    return [team_logos, col];
  };

  const renderPlayers = () => {
    let amount = Math.min(MAX_PLAYERS, matchedPlayers.length);
    let players_to_render = matchedPlayers.slice(0, amount);

    return players_to_render.map((player) => {
      let logos = generateLogos(player);
      let teams = logos[0];
      teams = new Set(teams);
      teams = Array.from(teams);

      let positions = player.position.join(", ");

      return (
        <div
          className="player"
          key={`${player.name}-${player.position.join('')}-${player.years_played[0]}`}
          onClick={() => {
            changeSquare(player, currentSquare);
            closeModal();
          }}
        >
          <div className="player-info">
            <div className="player-name">
              {isHint && !revealNames ? "?" : player.name} - {positions}
            </div>
            <div className="years-played">
              ({player.years_played[0]} - {player.years_played[1]})
            </div>
          </div>

          <div className="player-logos">
            <div className="player-divider"></div>
            <div className="player-team">
              {teams
                ? teams.map((team, i) => (
                    <img src={team} alt="nfl team" key={i} />
                  ))
                : null}
            </div>
          </div>
        </div>
      );
    });
  };

  return <div className="container">{renderPlayers()}</div>;
}

export default Player;
