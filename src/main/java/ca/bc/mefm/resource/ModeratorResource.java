package ca.bc.mefm.resource;

import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Moderator;
import ca.bc.mefm.data.User;

/**
 * Service endpoint for Moderator entity creation and retrieval
 * @author Robert
 */
@Path("/moderators")
public class ModeratorResource extends AbstractResource{

    /**
     * Fetches all Moderator entities
     * @return list of Moderators
     */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        DataAccess da = new DataAccess();
        
        List<Moderator> list = da.getAll(Moderator.class);
        list = list.stream().filter(moderator -> {
        	return moderator.getStatus() == Moderator.Status.ENABLED;
        }).collect(Collectors.toList());
        
        return responseOkWithBody(list);
    }

    /**
     * Creates a new Moderator
     * @param Comment
     * @return
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(Moderator moderator) {    	
        DataAccess da = new DataAccess();
        da.put(moderator);
        return responseCreated(moderator.getId());
    }
    
    /**
     * Changes the status of a Moderator, and the moderator user 
     * @param id
     * @param status
     * @return
     */
    @PUT
    @Path("{id}")
    public Response setStatus(@PathParam("id") Long id, @QueryParam("status") Moderator.Status status) { 
        DataAccess da = new DataAccess();
        
        Moderator moderator = da.find(id, Moderator.class);
        if (moderator == null) {
        	return this.responseBadRequest("No Moderator with id " + id);
        }
        moderator.setStatus(status);
        da.put(moderator);
        
        User user = da.find(moderator.getUserId(), User.class);
        user.setStatus(status.equals(Moderator.Status.ENABLED) ? User.Status.ENABLED : User.Status.SUSPENDED);
        da.put(user);
   	
    	return this.responseNoContent();
    }
}
