package ca.bc.mefm.resource;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.User;
import ca.bc.mefm.mail.MailSender;

/**
 * Service endpoint for support requests
 * @author Robert
 */
@Path("/support")
public class SupportResource extends AbstractResource{

    /**
     * Sends an email in response to a user's entry in the Contact Us form 
     * @param message the body of the request message
     * @param userId Id of the user making the request 
     * @return
     * , @QueryParam("user") Long userId
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response send(String message, @QueryParam("user") Long userId) {   
        DataAccess da = new DataAccess();
        User user = da.find(userId,  User.class);
        MailSender.sendSupportRequest(user, message);
        return this.responseNoContent();
    }
}
