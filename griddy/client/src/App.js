import React from "react";
import "./styles/App.css";
import Grid from "./Grid";

function App() {
  const [players, setPlayers] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data.message));
  }, []);

  return (
    <div>
      <Grid players={players} />
    </div>
  );
}

export default App;
