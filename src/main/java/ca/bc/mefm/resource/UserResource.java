package ca.bc.mefm.resource;

import java.util.List;
import java.util.logging.Logger;
import java.util.Date;
import java.util.Iterator;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.User;
import ca.bc.mefm.mail.MailSender;
import ca.bc.mefm.security.TokenGenerator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Service endpoint for retrieval and creation of User entities 
 * @author Robert
 */
@Path("/users")
public class UserResource extends AbstractResource{

	private static final Logger log = Logger.getLogger(MailSender.class.getName());

    /**
     * Fetches all User entities, with password removed
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers(){
        DataAccess da = new DataAccess();
        List<User> list = da.getAll(User.class);
        return responseOkWithBody(list.stream().map(user -> user.withoutPassword()).toArray());
    }    
    
    /**
     * Creates a new User
     * @param User
     * @return
     */ 	
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(User newUser) {
        DataAccess da = new DataAccess();
        // Check if username or already taken. Objectify does nor support "OR"
        // expressions for filters, so get all and filter here
        List<User> users = da.getAll(User.class);
        Iterator<User> i = users.iterator();
        while (i.hasNext()) {
        	User user = i.next();
        	if (user.getUsername().equals(newUser.getUsername())) {
        		log.info("NameAlreadyTaken: " + user.getUsername());
        		return responseOkWithBody(new AuthResultNameAlreadyTaken());
        	}
        	if (user.getEmail().equals(newUser.getEmail())) {
        		log.info("EmailAlreadyTaken: " + user.getEmail());
        		return responseOkWithBody(new AuthResultEmailAlreadyTaken());
        	}
        }
        // Encrypt the password
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        newUser.setPassword(encoder.encode(newUser.getPassword()));
    	
        newUser.setStatus(User.Status.ENABLED);
        Long now = new Date().getTime();
        newUser.setCreated(now);
        newUser.setLastLogin(now);
        da.put(newUser);

		String token = TokenGenerator.generateToken(newUser.getUsername(), newUser.getRole().toString(), newUser.getId(), newUser.getLastLogin());
	    return responseCreated(newUser.getId(), token);
    }
    
    /**
     * Authenticates a user and generates a JSON Web Token
     * @param User
     * 
     */
    @POST
    @Path("auth")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticate(User credentials) {
        DataAccess da = new DataAccess();
    	User user = da.findByQuery(User.class, "username", credentials.getUsername());
    	if (user == null 
    			|| user.getStatus().equals(User.Status.SUSPENDED)) {
    		return Response.status(Response.Status.UNAUTHORIZED).build();
    	}
    	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    	if (!encoder.matches(credentials.getPassword(), user.getPassword())) {
    		return Response.status(Response.Status.UNAUTHORIZED).build();
    	}
    	else {
    		String token = TokenGenerator.generateToken(user.getUsername(), user.getRole().toString(), user.getId(), user.getLastLogin());
    		user.setLastLogin((new Date()).getTime());
    		da.put(user);
    	    return responseOkWithBody(token);
    	}
    }
    
    
    /**
     * Fetches a specific User
     * @param id
     * @return
     */
	@Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") Long id){
        DataAccess da = new DataAccess();
        User user = da.find(id, User.class);
        return responseOkWithBody(user);
    }
	
	public class AuthResultBadUser {
		private boolean userNotFound = true;
		public boolean getUserNotFound() {
			return userNotFound;
		}
	}
	public class AuthResultWrongPassword {
		private boolean invalidPassword = true;
		public boolean getInvalidPassword() {
			return invalidPassword;
		}
	}
	public class AuthResultNameAlreadyTaken {
		private boolean nameAlreadyTaken = true;
		public boolean getNameAlreadyTaken() {
			return nameAlreadyTaken;
		}
	}
	public class AuthResultEmailAlreadyTaken {
		private boolean emailAlreadyTaken = true;
		public boolean getEmailAlreadyTaken() {
			return emailAlreadyTaken;
		}
	}
}
