package ca.bc.mefm.resource;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.User;
import ca.bc.mefm.mail.MailSender;
import ca.bc.mefm.data.DataAccess.Filter;
import ca.bc.mefm.data.PasswordReset;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Service endpoint for handling password reset requests 
 * @author Robert
 */
@Path("/reset")
public class PasswordResetResource extends AbstractResource{

	private static final Logger log = Logger.getLogger(PasswordResetResource.class.getName());
	
	public enum Status {FOUND, NOT_FOUND}

	/**
     * Processes a request for a password reset
     * @param email the address to which the reset url will be sent. It must
     *        be the one the user registered with
     * @return
     */
	@Path("request")
	@POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response requestReset(String email) {
		
		log.info("Password reset request for " + email);
    	
    	// Search for the user with the specified email address
    	DataAccess da = new DataAccess();
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        		new Filter("email", email)	
        };
        List<User> list = da.getAllByFilters(User.class, filters);        
        
        if (list.size() == 0) {
        	// No user found for the email address
    		log.info("User " + email + " not found");
        	return responseOkWithBody(new Result(Status.NOT_FOUND, null)); 
        }        
        User user = list.get(0);
    	
        // Generate a code and record it.        
        String code = UUID.randomUUID().toString().substring(0, 8);
        PasswordReset passwordReset= new PasswordReset(user.getId(), code);
        da.put(passwordReset);
        
        // Send email to the user with the code
        MailSender.sendPasswordResetCode(user, code);
        
        // Return it to client
        return responseOkWithBody(new Result(Status.FOUND, code));
    }
    
	@Path("confirm")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response submitCode(String code) {
    	// Search for a user with the code
    	DataAccess da = new DataAccess();
		PasswordReset record = getResetRecord(da, code);
        
        Status status = record == null ? Status.NOT_FOUND : Status.FOUND;
        return responseOkWithBody(new Result(status, null));
    }

    /**
     * Processes a request for a password reset
     * @param email the address to which the reset url will be sent. It must
     *        be the one the user registered with
     * @return
     */
	@Path("finish")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(Map<String, String> reset) {
    	// Fetch the reset record 
    	DataAccess da = new DataAccess();
    	PasswordReset record = getResetRecord(da, reset.get("code"));
    	
    	// Get the user and reset the password
    	User user = da.find(record.getUserId(), User.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(reset.get("password")));
        da.put(user);
        
        // Delete the reset record
        // TODO remove expired ones
        da.delete(record);        
    	
    	return responseNoContent();
    }
	
	private PasswordReset getResetRecord(DataAccess da, String code) {
        DataAccess.Filter[] filters = new DataAccess.Filter[] {
        	new Filter("code", code)	
        };
        List<PasswordReset> list = da.getAllByFilters(PasswordReset.class, filters);
		return (list.size() == 0 ? null : list.get(0));
	}
    
    @Getter
    @AllArgsConstructor
    public class Result{    	
    	private Status status;
    	private String uuid;
    	
    	public Result() {}
    }
}
