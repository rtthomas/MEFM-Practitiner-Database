package ca.bc.mefm.resource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.DataAccess.Filter;
import ca.bc.mefm.data.RecommendationAction;

/**
 * Service endpoint for RecommendationAction entity retrieval and creation.
 * Note that only actions of type RecommendationAction.ActionType.RATE are 
 * created (as opposed to retrieved) here. For the the other types, the
 * RecommendationAction is recorded by :
 * <li>
 * ActionType.CREATE: PractitionerInformationResource
 * </li> 
 * <li>
 * ActionType.EDIT: PractitionerInformationResource
 * </li> 
 * <li>
 * ActionType.COMMENT: CommentResource
 * </li> 
 * @author Robert
 */
@Path("/actions")
public class RecommendationActionResource extends AbstractResource{

    /**
     * Creates one or more new RecommendationActions
     * @param List of recommendationAction
     * @return
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(RecommendationAction[] recommendationActions) {
        DataAccess da = new DataAccess();
        List<Long> ids = new ArrayList<Long>();
        List<RecommendationAction> actions = Arrays.asList(recommendationActions);
        actions.forEach(action ->{
            da.put(action);
            ids.add(action.getId());
        });
        return responseCreated(ids);
    }

    /**
     * Fetches all RecommendationAction by a specified User
     * @param id
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByUser(@QueryParam("userId") Long userId){
        DataAccess da = new DataAccess();
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        		new Filter("userId ==", userId)	
        };
        List<RecommendationAction> list = da.getAllByFilters(RecommendationAction.class, filters);
        return responseOkWithBody(list);
    }

    /**
     * Fetches all RecommendationAction for a specified Practitioner
     * @param id
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{practitionerId}")
    public Response getByPractitioner(@PathParam("practitionerId") Long practitionerId){
        DataAccess da = new DataAccess();
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        		new Filter("practitionerId ==", practitionerId)	
        };
        List<RecommendationAction> list = da.getAllByFilters(RecommendationAction.class, filters);
        return responseOkWithBody(list);
    }

    /**
     * Fetches all RecommendationAction by a user for a specified Practitioner
     * @param id
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{practitionerId}/{userId}")
    public Response getByPractitionerAndUser(
    		@PathParam("practitionerId") Long practitionerId,
    		@PathParam("userId") Long userId){
    	
        DataAccess da = new DataAccess();
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        		new Filter("practitionerId ==", practitionerId),
        		new Filter("userId ==", userId)
        };
        List<RecommendationAction> list = da.getAllByFilters(RecommendationAction.class, filters);
        return responseOkWithBody(list);
    }
}
