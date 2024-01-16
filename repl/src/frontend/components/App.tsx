import React, { useState } from "react";
import REPL from "./REPL";
import "../styles/App.css";

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="App">
      <div
        className={`App-header ${isPanelOpen ? "panel-open" : "panel-closed"}`}
      >
        <h1 style={{ marginTop: "4px", marginBottom: "10px" }}>REPL</h1>
        {isPanelOpen && (
          <>
            <div>
              <span style={{ color: "lightblue" }}>"load [file_path]"</span> to
              load csv in data folder (ex. <span style={{ color: "lightblue" }}>"load data/custom/zillow.csv"</span>)
            </div>
            <div>
              <span style={{ color: "lightblue" }}>"view"</span> to view csv
            </div>
            <div>
              <span style={{ color: "lightblue" }}>
                "search [has_headers] [search_value] [column_identifier]"
              </span>{" "}
              to search column csv where{" "}
              <span style={{ color: "lightblue" }}>has_headers</span> is
              true/false and{" "}
              <span style={{ color: "lightblue" }}>column_identifier</span> is
              column name/column index
            </div>
            <div>
              <span style={{ color: "lightblue" }}>
                "search [has_headers] [search_value] *"
              </span>{" "}
              to search all columns csv where{" "}
              <span style={{ color: "lightblue" }}>has_headers</span> is
              true/false
            </div>
            <div>
              <span style={{ color: "lightblue" }}>
                "broadband [state] [county]"
              </span>{" "}
              to get cached broadband access percent of county in state
            </div>
            <div>
              <span style={{ color: "lightblue" }}>"mode brief"</span> to
              display only history output or{" "}
              <span style={{ color: "lightblue" }}>"mode verbose"</span> to
              display both history command and output
            </div>
            <div>
              <span style={{ color: "lightblue" }}>
                "register [command] [function_to_execute]"
              </span>{" "}
              to register a new command
            </div>
            <div>
              <span style={{ color: "lightblue" }}>
                "clear"
              </span>{" "}
              to clear command history
            </div>
          </>
        )}
        <button
          onClick={togglePanel}
          style={{ marginBottom: "10px", border: "1px solid white" }}
        >
          {isPanelOpen ? "Close Instructions" : "Open Instructions"}
        </button>
      </div>
      <div className="main-content">
        <REPL isPanelOpen={isPanelOpen} />
      </div>
    </div>
  );
}

export default App;
