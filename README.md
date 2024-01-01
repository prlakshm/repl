## Sprint 4: Repl ReadMe

[Repo](https://github.com/cs0320-f23/repl-jzdzilow-prlakshm.git)  
In a nutshell: Web-based interactive command-line interface allowing for the
loading, retrieval, and search of data through command input as well as fetching of broadband access percent via interaction with the simultaneously running backend (Server), by calls to its appropriate endpoints. Displays either that input's result, or both the result and the command itself.

Team members: jzdzilow and prlakshm. We worked on the vast majority of the project asynchronously by implementing different functionalities on separate branches, as well as by pair programming, where we sat together and switched roles as the driver/navigator.

Total estimated time: ~30 hours

### Running the program:

0. Upon building the project, run Server.java located in the server directory, and cd into repl via
   the command line interface. Install the node package menager (via npm install or sudo npm install in case of restriction issues). Open a new terminal and cd into repl. Install express and cors through npm install. Then, run the local server that houses the mocked json data inputting into the command line node server.js. In a new terminal, run the frontend via npm start within repl; redirect to the newly opened local host. Results of the inputted commands (in case of a non-mocked "mode") will be fetched from the backend server. Inaccurate number of arguments for all commands below will result in an error response (additional arguements aren't ignored - see design choices).

1. Loading data:  
   On the web app, input "load your_filepath", with the your_filepath
   representing the location containing the to-be-loaded CSV data.
   Upon successful load, the Command History should contain the result of the performed actions and the filepath of loaded data. Filepath cannot be empty, and must be located in the 'data' directory. If no filepath is passed in, or the filepath either can't be found or is located in an inaccessible directory, the server will return an informative response outlining the issue. Only one file is stored at the time - running command repeatedly overrides the previously fetched content.

   > example: "load data/custom/zillow.csv"

2. Viewing data:  
   Input "view" to display the contents of a most recently loaded dataset.
   Possible only with data previously loaded, and can be only performed on
   the most recently inputted filepath (only one dataset stored at the time). If successful, Command History should, in addition to previous commands, display a table with the entirety of CSV file's contents as a table; otherwise will return an informative response (either CSV file not loaded, or
   no data to display in case of an empty CSV file).

   > example: "view"

3. Searching through data:  
   Input "search has_headers your_value your_column_identifier".
   Has_headers corresponds to whether the loaded csv has headers or not, and although they're parsed (and thus displayed) the same way as rows, different input for has_headers influences results of the search (can't search for a value within a row, if it's considered a header). Any input other than true or false implies that the headers aren't present.
   Column identifier corresponds to either the index (starting with 0) or header name to look for if the loaded csv has non-numeric headers as specified by the user via the command. Allows for searching through all columns with the "\*" input.
   The sought-after value must be included, and if is comprised of more than a single word, requires using underscore as an equivalent of whitespace. Applicable also to header names, if non-numeric. Possible only with data previously loaded.
   If successful, Command History will display the result of performed search (all rows containing a sought-after value); otherwise (if any of the parameters are missing, are invalid, or the file hasn't been properly loaded) will return an informative message outlining the issue.
   If no rows satisfying the query been found, will return an informative result (no data to display).

   > example: "search true Alice 0"

4. Fetching broadband data:  
   Input "broadband your_state your_county".
   By default, all commands are using real data by connecting to the API; broadband percent is accessed by passing the request via the Repl backend server to the ACS API.

   County must be within the provided state to return an appropriate broadband access percent. Server utilizes caching - if the data for a particular state/county pair had been retrieved previously, the susbequent request won't trigger a call to the ACS API.

   If successful, Command History will display the the broadband access percent as well as time of retrieval (remains the same upon the second request due to caching - displays the time of the initial data fetch); otherwise (if any of the parameters are missing or are invalid) will return an informative message outlining the issue.

   > example: "broadband North_Carolina Durham"

5. Changing the mode:  
   Input "mode your-mode". Mode can be either brief or verbose, with the former
   being the default. Upon changing the mode, all elements of the history are rerendered to contain relevant elements of the output. In brief mode, it's exclusively the command's result; in verbose mode, it's both the command, and the result. If mode entered is not valid, or not provided, the Command History will display an informative message. Mode changes are displayed in the Command History as any other command input.

> example: "mode verbose"

6. Registering commands:  
   Input "register command_name function_to_execute".
   Command name is the call required from the user as a REPL prompt for executing a function (just as load, view, search, etc.). Must be a single word value.
   Function to execute is the name (string type) of the handle(...):REPLFunction that is performed whenever user inputs the appropriate command name via the CLI (just as handleLoad, handleView, etc.). Must be included in the REPLInput component; if can't be found by the eval() functions associating that function with a command name, will return an appropriate error response (ReferenceError: your_function is not defined).

   By default, load, view, search, broadband, mode, and register commands are pre-registered (for testing purposes), but can be easily removed from Repl's functionality by not being added to the REPLInput's commandRegistry map upon mount (can be done via commenting out appropriate code lines in one of the useEffect hooks).

   If the command is already in the map, it's not possible to override it (each command name is associaed with only one function to be performed upon actual call). If the to-be-executed function is already associated with a command, it can be used subsequently regardless (can have load1 and load2 both point to handleLoad, but not load1 to point to multiple functions).

> example: "register load2 handleLoad"

7. Mocking:
   Input "mockload any_filepath" to display a mocked json of a successfully loaded csv message.
   No matter, what filepath is inputed, the same response will always generate, because the
   json is mocked in public/load.json.

   Input "mockview" to view a mocked json of csv data. This data will display as a table.
   This command will work regardless of whether you already loaded a file, because it always
   retreives its information from the public/view.json.

   Input "mocksearch hasHeaders any_val any_colID" to view a mocked json of a csv search
   result. No matter what the hasHeaders, any_val, or any_colID argument are the same rows
   of csv data will be displayed as a table. This is because the command will always retreive
   from public/search.json.

   Input "mockbroadband any_state any_county" to return a mocked json of broadband data.
   This command will always return the broadband percent of Durham, North Carolina regardless
   of what any_state and any_county arguments you enter, because the response points to the same
   json in public/broadband.json.

8. Accessibility:
   All components and their contents can be vocalized via a ScreenReader, with descriptive aria labels accessed by the program outlining the REPL's elements' functionalities or ways of use. The interface is also fully usable on any Zoom level, due to the utilization of flex boxes and relative (dynamic) sizing using viewport units rather than predefined values.

   Keyboard shortcuts provided for simplified, and user-friendly interactions with the REPL interface:

   - Ctrl+b; navigates cursor to command box
   - Enter; submits the command without requiring the user to click the button

### Design Choices

**The datatypes** corresponding to inputs to the history are the **CommandResultMap** and **history**. The former (a map) stores commands as HistoryItems and associates them with their outputs, while the latter (an array) stores exclusively the HistoryItems, and iterates though them in the REPLHistory class to display them chronologically, while retrieving their corresponding outputs from the CommandResultMap. **commandRegistry**, on the other hand, is a map storing all the currently registered commands that can be accessed via the end-user of the REPL.

**HistoryItem** is an element representing a single command input - it's an interface containing the command (a string), and the time of user's input (a number). It allows for differentiation between the same command values posted at different times, thus potentially with different outputs (f.e. prevents the reassigning of outputs
associated to the same load data/custom/zillow.csv command in the CommandResultMap, depending on whether it has, or hasn't been loaded at the specified time).

**Mode changes** are displayed as a command in the history despite not interacting with the API itself. Upon changing the mode, all previous commands and their outputs are rerendered to display the relevant information (either just the output in mode brief, or both the otuput and the command in mode verbose). The default mode is brief.

**Inputting an erroneous command (either not yet registered, or with invalid inputs)** is still considered a "valid" call: displayed in command history with informative message regarding its erroneous nature.

**Inputting either a command with too many, or too little arguments** is considered an erroneous command, as additional parameters aren't ignored, and missing ones aren't substituted with default values.

**Creating a local server** was needed to host mock jsons. The local server accesses jsons in the file
system that mocks server data. Without the real server backend, this local server mocks the returns
of the real server. fetch statements only take in urls, so creating a local server was necessary to mock how the program would fetch data from a url, parse it into a json, and return it as a promise.

### High-Level Design

- `App`: The highest-level component that sets up the REPL interface.
- `REPL`: The main component responsible for managing the command history and input.
- `REPLHistory`: A component for displaying the command history and corresponding results.
- `REPLInput`: Handles user input, command execution, and updates to the history.
- `ControlledInput`: A user's input component associated with the command input box.
- `MockedREPLFunctions`: A component for setting up mocked server commands.

### Relationships Between Modules/Interfaces

- `App` renders the `REPL` component.
- `REPL` contains `REPLHistory` and `REPLInput`.
- `REPLInput` communicates with `REPLHistory` and updates the command history.
- `REPL` and `REPLHistory` interact with the `commandResultMap`; a `Map` that associates each command with its result, allowing for efficient command history management. `commandResultMap` is passed into `REPLInput`, allowing for the updates to be made. `registerCommandMap` is an REPLInpput-specific dataset containing the names of currently registered command names mapping to the respective, to-be-executed upon call functions. By default, register, load, view, search, and broadband functions as well as their mock equivalents are all included (see "running the program - registering commands")
- `MockedREPLFunctions` functions are all imported into `REPLInput` and registered to use.
- `HistoryItem` interface representing a single command input into the history. See "Design Choices" for further explanation.

### Running tests
**Important preface**: we've decided to not utilize Jest testing, as all of our frontend tests interact with the real backend data - thus, we're checking the actual outputs of the server rather than simply ensuring the proper rendering of frontend components. This way, we're also testing the functionality of the register command, as it's one accessible via REPL and interacts with the values returned in the frontend.

To run the front-end centered tests for this project, run the java Server.js, install Playwright (cd into repl; input npx playwright install), and run its tests (npx playwright test). For a user-friendly display, input npx playwright test --ui. Testing suite will ensure the reliability of the REPL, checking the state of its rendered components. There are separate test files for the load, view, search, broadband, and mode commands; register is included in the main App.spec testing suite. There is also a test file to check that the page loads correctly (App.spec.ts). You can run these files individually using (npx playwright test <filename>).

`IMPORTANT: Tests using real data WILL FAIL if ran in a different order than specified within test suites (previously loaded data remains stored in the backend server - thus, results of some commands can be different, especially if they were meant to be performed on a non-loaded dataset). To avoid "erronous fails", DON'T execute view/search tests simultaneously, as they'd be interfering with the backend at the same time and modifying the data at the same time as others.`

In addition, there's also a separate test suite that tests the mock functions. To run it, cd into repl, and call node server.js as well as npm start in another terminal, which will set up separate servers for preserving mocked data. This tests that no matter what arguments you enter into "mockload", "mockview", "mocksearch", "mockbroadband", you always output the same data. This is because the json data on the local server is hardcoded to return the same result. The only way to display an error message is if the right number of arguments are not
used.

Examples of front-end tests provided:
All types of possible commands are mocked, but not all possible combinations within a specified dataset. In case of the command being technically proper (corrent number of parameters, etc.) but not having been mocked, Command History will display a relevant message.
Examples of mocked commands/responses:

- load commands with proper filepaths
- load commands with nonexistent files
- load commands with filepaths in inaccessible directories (other than data/)
- load commands with no filepath included
- view commands with empty datasets
- view commands with regular (y x y, with y!=0) datasets
- view commands with single-column datasets
- view commands with single-row datasets
- view commands with no datasets loaded
- view commands with datasets with headers
- view commands with datasets with no headers
- search commands with all proper values (either header titles or indices)
- search commands with nonexistent column titles
- search commands with column indices out of bounds
- search commands with multiple rows as a result
- search commands with single row as a result
- search commands with no sought-after rows found
- search commands on not loaded datasets
- search commands on empty datasets

Back-end tests checking the appropriateness of load/view/search/broadband functions utilized in the front-end are provided within the backend/src/test/server directory, and can be run via right-clicking on the desired suite.

### Errors/Bugs

None that we know of!
