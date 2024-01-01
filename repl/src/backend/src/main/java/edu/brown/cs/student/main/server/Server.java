package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import com.google.common.cache.CacheBuilder;
import edu.brown.cs.student.main.sources.AcsCensusSource;
import edu.brown.cs.student.main.sources.CensusSource;
import edu.brown.cs.student.main.sources.mocks.StaleMockCensusSource;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;
import spark.Spark;

/**
 * The top-level class for our Server project. Contains the main() method which starts Spark and
 * runs the various handlers for our four endpoints: /loadcsv, /viewcsv, /searchcsv, /broadband.
 *
 * <p>These four endpoints need to share state, so they share the csvData object of type
 * CsvDataWrapper. This wrapper allows for dependency injection, as well as defensive programming,
 * as its get method to access the actual List of List of String representing rows of CSV data
 * returns an unmodifiable copy of said data.
 *
 * <p>Also allows a developer using these endpoints to create their own CacheBuilder, or pass a null
 * CacheBuilder to the constructor, to specify how they want responses from the source to be cached,
 * or for responses not to be cached at all (the null case).
 *
 * @author sarahridley juliazdzilowska
 * @version 1.0
 */
public class Server {

  static final int port = 3232;

  /**
   * The constructor for the Server class.
   *
   * @param source the CensusSource object representing the source to get broadband data from
   * @param cacheBuilder the CacheBuilder object representing null, to specify no cache, or a
   *     CacheBuilder object specifying how requests should be cached
   */
  public Server() {
    // CensusSource source = new AcsCensusSource(); 
    // CacheBuilder cacheBuilder = new CacheBuilder(); 
    // newBuilder().maximumSize(1000).expireAfterWrite(10, TimeUnit.MINUTES); 
    CsvDataWrapper csvData = new CsvDataWrapper(new ArrayList<>(), false);
    Spark.port(port);
    after(
        (request, response) -> {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Methods", "*");
        });

    // Setting up the handler for the GET /order and /mock endpoints
    Spark.get("loadcsv", new LoadCsvHandler(csvData));
    Spark.get("viewcsv", new ViewCsvHandler(csvData));
    Spark.get("searchcsv", new SearchCsvHandler(csvData));
    Spark.get("broadband", new BroadbandHandler(new AcsCensusSource(),
    CacheBuilder.newBuilder().maximumSize(1000).expireAfterWrite(10, TimeUnit.MINUTES)));
    Spark.get("mockbroadband", new BroadbandHandler(new StaleMockCensusSource(),
    CacheBuilder.newBuilder().maximumSize(1000).expireAfterWrite(10, TimeUnit.MINUTES)));
    Spark.init();
    Spark.awaitInitialization();
  }

  /**
   * The main method of the Server class which starts the server and then exits.
   *
   * @param args the command line arguments, which are not accessed
   */
  public static void main(String[] args) {
    new Server();
    System.out.println("Server started at http://localhost:" + port);
  }
}
