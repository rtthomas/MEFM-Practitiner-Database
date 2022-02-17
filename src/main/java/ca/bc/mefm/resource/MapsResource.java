package ca.bc.mefm.resource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.GoogleMapsApi;
import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Practitioner;

/**
 * Services requests for distance calculations by the Google Maps API
 * @author Robert
 *
 */
@Path("/maps")
public class MapsResource extends AbstractResource{
    
	/**Google
     * @param from 
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findDistance(@QueryParam("from") String from, @QueryParam("to") String to){
    	
    	String[] practitionerIds = to.split("\\|");
        
    	DataAccess da = new DataAccess();
    	// TODO Country kludge
    	List<String> destinations = Arrays.asList(practitionerIds).stream()
    	.map( id -> {
    		Practitioner practitioner = da.find(Long.valueOf(id), Practitioner.class);
    		StringBuilder sb = new StringBuilder()
    				.append(practitioner.getPostalCode())
    				.append('+')
    				.append("Canada");
    		return sb.toString() ;
    	})
    	.collect(Collectors.toList());
    	
    	
        List<GoogleMapsApi.Distance> distances = GoogleMapsApi.getDistances(from, destinations.toArray(new String[] {}));
        return responseOkWithBody(distances);
    }

}
