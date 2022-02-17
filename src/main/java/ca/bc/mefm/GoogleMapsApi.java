package ca.bc.mefm;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import com.google.maps.DistanceMatrixApiRequest;
import com.google.maps.GaeRequestHandler;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElementStatus;
import com.google.maps.model.DistanceMatrixRow;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Wraps methods for invoking the Google Maps API
 * @author Robert
 */
public class GoogleMapsApi {
	
	private static final Logger log = Logger.getLogger(GoogleMapsApi.class.getName());

	private static GeoApiContext 	context;	
	private static GoogleMapsApi 	instance;	
	
	private GoogleMapsApi() {
		String key = DatabaseProperties.get("mapsapi.key");
		if (key == null) {
			// In the development environment, there is no datastore Property entity 
			// for the api key. It should then be found as a local system property
			key = System.getenv("mapsapi.key");
			if (key == null) {
				log.log(Level.SEVERE, "The mapsapi.key variable is not set");
				System.exit(-1);
			}
		}
		context = new GeoApiContext.Builder(new GaeRequestHandler.Builder())
				.apiKey(key).build();
	}	
	
	// Singleton instance
	private static GoogleMapsApi instance() { 
		if (instance == null){ 
			synchronized (GoogleMapsApi.class) { 
				if(instance==null){ 
					instance = new GoogleMapsApi(); 
				} 
			} 
		} 
		return instance; 	
	}

	/**
	 * Gets the distances from a start location to a set of destination locations
	 * @param from
	 * @param destinations
	 * @return a List of strings with the distances in "human readable" form
	 * TODO: Need to return them as numbers to ensure that sorting wotks correctly
	 */
	public static List<Distance> getDistances(String from, String[] destinations) {
		
		String[] origins = new String[] {from};
		
		DistanceMatrixApiRequest request = new DistanceMatrixApiRequest(instance().context)
				.origins(origins)
				.destinations(destinations);
		
		try {
			DistanceMatrix matrix = request.await();
			DistanceMatrixRow[] rows = matrix.rows;
			List<Distance> distances = Arrays.asList(rows[0].elements)
				.stream()
				.map(element -> {
					if (element.status.equals(DistanceMatrixElementStatus.OK)) {
						return new Distance(element.distance.humanReadable, element.distance.inMeters);
					}
					else {
						return new Distance("Not found", -1L);
					}
				})
				.collect(Collectors.toList()
			);
			return distances;
		}
		catch (Exception e) {
			return Arrays.asList(new Distance[] {new Distance(e.getMessage(), -1L)});
		}
	}
	
	@AllArgsConstructor
	@Getter
	public static class Distance {
		private String humanReadable;
		private Long inMeters;
	}
}
