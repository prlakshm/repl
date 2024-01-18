import "../styles/main.css";
import { HistoryItem } from "../types/HistoryItem";

/**
 * Props for the REPLHistory component.
 */
interface REPLHistoryProps {
  commandHistory: HistoryItem[];
  mode: string;
  commandResultMap: Map<HistoryItem, [[]] | string>;
  isPanelOpen: boolean;
  ariaLabel: string;
}

/**
 * Component responsible for displaying the command history and corresponding results.
 * @param {REPLHistoryProps} props - The properties required for rendering the component.
 */
export function REPLHistory(props: REPLHistoryProps) {
  const { commandHistory, mode, commandResultMap, isPanelOpen, ariaLabel } =
    props;

  // Adjust the height dynamically based on the panel state
  const historyHeight = isPanelOpen ? "36.25vh" : "62vh";

  /**
   * Function for rendering different types of data in the command history.
   * @param {[[]] | string} data - The data to be rendered.
   * @returns {JSX.Element} - The rendered data as JSX.
   */
  const renderData = (data: [[]] | string) => {
    if (data.length === 0) {
      return "No data to display";
    }
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return (
        <table className="center-table">
          <tbody>
            {data.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (typeof data === "string") {
      return data;
      // } else {
      //   return JSON.stringify(data);
    }
  };

  return (
    <div
      className="repl-history"
      style={{ height: historyHeight }}
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <h2 aria-live="polite">Command History</h2>
      <ul>
        {commandHistory.map((command, index) => (
          <div key={index} className="history-element">
            <li>
              {mode === "brief" ? (
                <div className="text-box" aria-live="polite">
                  Output:{" "}
                  {renderData(commandResultMap.get(command) ?? "No data")}
                </div>
              ) : (
                <div className="text-box" aria-live="polite">
                  <p>Command: {command.command}</p>
                  <div>
                    Output:{" "}
                    {renderData(commandResultMap.get(command) ?? "No data")}
                  </div>
                </div>
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
