package ca.bc.mefm.resource;

import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.Comment;
import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Moderator;
import ca.bc.mefm.data.DataAccess.Filter;
import ca.bc.mefm.data.Practitioner;
import ca.bc.mefm.data.RecommendationAction;
import ca.bc.mefm.data.User;
import ca.bc.mefm.mail.MailSender;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Service endpoint for Comment entity creation and retrieval
 * @author Robert
 */
@Path("/comments")
public class CommentResource extends AbstractResource{

    /**
     * Creates a new Comment
     * @param Comment
     * @return
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(Comment comment) {    	
        DataAccess da = new DataAccess();
        da.put(comment);
        
        // Record the action
        RecommendationAction action = new RecommendationAction(
        		comment.getUserId(),
        		comment.getPractitionerId(),
        		comment.getDate(),
        		RecommendationAction.ActionType.COMMENT
        		);
        da.put(action);

		User user = da.find(comment.getUserId(), User.class);
		Practitioner practitioner = da.find(comment.getPractitionerId(), Practitioner.class);
		Moderator moderator = da.findByQuery(Moderator.class, "province", practitioner.getProvince());
		String moderatorEmail = da.find(moderator.getUserId(), User.class).getEmail();
		
		CommentWrapper wrapper = new CommentWrapper(user, practitioner, comment);
		MailSender.sendCommentNotification(moderatorEmail, wrapper, "posted");
        
        return responseCreated(comment.getId());
    }
    
    /**
     * Updates a comment's status
     */
    @PUT
    @Path("{commentId}")
    public Response update(@PathParam("commentId") Long commentId, @QueryParam("status") Comment.Status status) {
        DataAccess da = new DataAccess();
        Comment comment = da.find(commentId, Comment.class);
        comment.setStatus(status);
        da.put(comment);
        
        if (status == Comment.Status.FLAGGED) {
			User user = da.find(comment.getUserId(), User.class);
			Practitioner practitioner = da.find(comment.getPractitionerId(), Practitioner.class);
			Moderator moderator = da.findByQuery(Moderator.class, "province", practitioner.getProvince());
			String moderatorEmail = da.find(moderator.getUserId(), User.class).getEmail();
			
			CommentWrapper wrapper = new CommentWrapper(user, practitioner, comment);
			MailSender.sendCommentNotification(moderatorEmail, wrapper, "flagged");
        }
    	
    	return responseNoContent();
    }
    
    /**
     * Updates the status of a set of comments, and sends emails to the
     * authors of those which have been blocked.
     * @param comments
     * @param moderator the user id of the moderator making the request
     * @return
     */
    @Path("resolve")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response resolve(List<Comment> comments, @QueryParam("moderator") Long moderatorId) {
    	DataAccess da = new DataAccess();
    	
    	// Look up the email address of the moderator
    	User moderator = da.find(moderatorId, User.class);
    	
    	comments.stream().forEach( comment -> {
    		da.put(comment);
    		if (comment.getStatus().equals(Comment.Status.BLOCKED)) {
    			User user = da.find(comment.getUserId(), User.class);
    			Practitioner practitioner = da.find(comment.getPractitionerId(), Practitioner.class);
    			CommentWrapper commentWrapper = new CommentWrapper(user, practitioner, comment);
    			MailSender.sendBlockedNotification(moderator.getEmail(), commentWrapper);
    		}
    	});
        return responseNoContent();
    }
    
    /**
     * Fetches all Comments with a specified status for practitioners in a specified province
     * @param status
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByStatus(@QueryParam("status") Comment.Status status, @QueryParam("province") String province){
        DataAccess da = new DataAccess();
        // Fetch all comments with the specifies status
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        		new Filter("status", status)	
        };
        List<Comment> list = da.getAllByFilters(Comment.class, filters);
        // Filter out those for practitioners who are not in the specified province
        // TODO: This is brute force. Put provinces and practitioners in maps
        list = list.stream().filter(comment -> {
        	Long practitionerId = comment.getPractitionerId();
        	Practitioner practitioner = da.find(practitionerId, Practitioner.class);
        	return province.equals(practitioner.getProvince());
         }).collect(Collectors.toList());
        
        return responseOkWithBody(list);
    }

    /**
     * Fetches all Comments for a specified practitioner
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
        List<Comment> list = da.getAllByFilters(Comment.class, filters);
        return responseOkWithBody(list);
    }

    /**
     * Fetches all Comments by a specified user for a specified practitioner
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
        List<Comment> list = da.getAllByFilters(Comment.class, filters);
        return responseOkWithBody(list);
    }
    
    /**
     * Wraps the user who created a blocked comment along with the practitioner the
     * comment was directed to.
     * @author Robert
     *
     */
    @Data
    @AllArgsConstructor
    public class CommentWrapper {
    	private User			user;
    	private Practitioner 	practitioner;
    	private Comment			comment;
    }
}
