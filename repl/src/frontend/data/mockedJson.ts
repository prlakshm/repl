/**
 * Function mocking load_file input commands and their corresponding outputs.
 */
export function mockedLoadData(
  input: string[],
  setLoadedDataset: React.Dispatch<React.SetStateAction<string | null>>
): string {
  if (input.length < 2) {
    return "Error: Missing filepath argument";
  }
  const filePath = input[1];
  const paths: String[] = filePath.split("/");
  if (!(paths[0] === "data")) {
    return "Filepath located in an inaccessible directory";
  }
  if (!isFilePathValid(filePath)) {
    return "Error: File " + filePath + " not found";
  } else {
    setLoadedDataset(filePath);
    return filePath + " has been loaded properly";
  }
}

/**
 * Function checking the validity of an inputted filepath depending on mocked filepaths.
 */
function isFilePathValid(filePath: string): boolean {
  const validFilepaths = [
    "data/dataset1.csv",
    "data/dataset2.csv",
    "data/dataset3.csv",
    "data/dataset4.csv",
    "data/dataset5.csv",
    "data/dataset6.csv",
  ];
  return validFilepaths.includes(filePath);
}

/**
 * Function mocking view input commands and their corresponding outputs.
 */
export function mockedViewData(loadedDataset: string | null): any {
  const viewMap = new Map<String, any>();
  const dataset1 = [
    ["Owner", "Price", "City"],
    ["Alice", "300000000", "New York"],
    ["Bob", "250000000", "San Francisco"],
  ];
  const dataset2 = [
    ["Owner", "Price", "City"],
    ["Eve", "280000000", "Los Angeles"],
    ["Charlie", "220000000", "Chicago"],
  ];
  const dataset3 = [
    ["Type", "Color", "Brand"],
    ["shirt", "black", "P&B"],
    ["jeans", "blue", "H&M"],
    ["blazer", "black", "H&M"],
  ];
  const dataset4 = [["huda", "julia", "partners"]]; // single row, no header
  const dataset5 = [["huda"], ["is"], ["only"], ["huda"]]; // single col, no header
  const dataset6 = [[]]; // single col, no header

  viewMap.set("data/dataset1.csv", dataset1);
  viewMap.set("data/dataset2.csv", dataset2);
  viewMap.set("data/dataset3.csv", dataset3);
  viewMap.set("data/dataset4.csv", dataset4);
  viewMap.set("data/dataset5.csv", dataset5);
  viewMap.set("data/dataset6.csv", "Empty CSV");

  if (loadedDataset === null) {
    return "Error: No file is loaded.";
  } else {
    const viewResult = viewMap.get(loadedDataset);
    return viewResult;
  }
}

/**
 * Function mocking search input commands and their corresponding outputs.
 */
export function mockedSearchData(
  trimmedCommand: string,
  loadedDataset: string | null
): any {
  /** The big map; keys are the dataset paths, and the values are hashmaps */
  const searchMap = new Map<String, any>();

  /** Hashmaps that go inside searchMap. The keys are the search commands,
   * and the values are the resulting 2D arrays
   */
  const dataset1Map = new Map<String, any>();
  const dataset2Map = new Map<String, any>();
  const dataset3Map = new Map<String, any>();
  const dataset4Map = new Map<String, any>();
  const dataset5Map = new Map<String, any>();
  const dataset6Map = new Map<String, any>();

  const emptySearch = [[]];

  // dataset 1 result
  const search11 = [["Alice", "300000000", "New York"]];
  // dataset 2 result
  const search21 = [["Eve", "280000000", "Los Angeles"]];
  // dataset 3 results
  const search31 = [
    ["jeans", "blue", "H&M"],
    ["blazer", "black", "H&M"],
  ];
  const search32 = [
    ["shirt", "black", "P&B"],
    ["blazer", "black", "H&M"],
  ];
  const search33 = [["jeans", "blue", "H&M"]];
  // dataset 4 (singular row, no header) results
  const search41 = [["huda", "julia", "partners"]];
  // dataset 5 (single column) results
  const search51 = [["huda"]];
  const search52 = [["only"]];

  const searchAllCols = [["Alice", "300000000", "New York"]];

  // set up the inner hashmaps for each dataset
  dataset1Map.set("search 0 Alice", search11);
  dataset1Map.set("search 0 Alice additional", search11);
  dataset1Map.set("search 0 Alice additional additional", search11);
  dataset1Map.set("search Owner Alice", search11);
  // search through all columns
  dataset1Map.set("search * Alice", searchAllCols);
  dataset1Map.set("search 2 Alice", emptySearch); // no results

  dataset2Map.set("search 0 Eve", search21); // col index
  dataset2Map.set("search Owner Eve", search21); // col name
  dataset2Map.set("search * Eve", search21); // no col specified
  dataset2Map.set("search 1 Eve", emptySearch); // no results

  dataset3Map.set("search 1 black", search32); // multiple results
  dataset3Map.set("search color black", search32); // multiple results
  dataset3Map.set("search color blue", search33); // single result
  dataset3Map.set("search brand H&M", search31); // multiple results
  dataset3Map.set("search cut H&M", "Column title does not exist");
  dataset3Map.set("search 10 H&M", "Column index out of bounds");
  dataset3Map.set("search * H&M", search31); // no col specified

  dataset4Map.set("search * huda", search41); // no col specified
  dataset4Map.set("search 0 huda", search41);
  dataset4Map.set("search 1 huda", emptySearch);
  dataset4Map.set("search 2 partners", search41);

  dataset5Map.set("search * huda", search51);
  dataset5Map.set("search 0 huda", search51);
  dataset5Map.set("search 0 huda additional", search51);
  dataset5Map.set("search * only", search52);
  dataset5Map.set("search 0 only", search52);

  dataset6Map.set("search * this", emptySearch);
  dataset6Map.set("search 0 value", emptySearch);
  dataset6Map.set("search value 0", emptySearch);
  dataset6Map.set("search 0 0", emptySearch);

  // add the inner maps to the big map
  searchMap.set("data/dataset1.csv", dataset1Map);
  searchMap.set("data/dataset2.csv", dataset2Map);
  searchMap.set("data/dataset3.csv", dataset3Map);
  searchMap.set("data/dataset4.csv", dataset4Map);
  searchMap.set("data/dataset5.csv", dataset5Map);
  searchMap.set("data/dataset6.csv", dataset6Map);

  const arrayInput = trimmedCommand.split(/\s+/);
  if (loadedDataset === null) {
    return "Error: No file is loaded";
  }
  if (arrayInput.length <= 2) {
    return "Error: Not enough parameters provided";
  } else {
    // const splitCommand = trimmedCommand.split(/\s+/);
    let searchResult = searchMap.get(loadedDataset).get(trimmedCommand);
    if (searchResult == null) {
      return "This command is not mocked";
      9;
    }
    if (searchResult == emptySearch) {
      searchResult = "No results found. Check if the loaded dataset is empty";
    }
    return searchResult;
  }
}
