package ca.bc.mefm.resource;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.UserRole;

/**
 * Service endpoint for retrieval of UserRole entities 
 * @author Robert
 */
@Path("/roles")
public class RoleResource extends AbstractResource{

    /**
     * Fetches all User entities
     * @return
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRoles(){
        DataAccess da = new DataAccess();
        List<UserRole> list = da.getAll(UserRole.class);
        return responseOkWithBody(list);
    }
    
}
