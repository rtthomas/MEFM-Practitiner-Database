package ca.bc.mefm.resource;

import java.util.Date;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.ErrorLog;

/**
 * Service endpoint for recording ErrorLog entities received from the
 * client. These describe internal errors in the client
 * @author Robert
 */
@Path("/errors")
public class ErrorLogResource extends AbstractResource{
    
	private static final Logger log = Logger.getLogger(ErrorLogResource.class.getName());
	/**
     * Creates a new ErrorLog entry
     * @param ErrorLog
     * @return
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(ErrorLog error) {
    	error.setTimestamp(new Date());
        DataAccess da = new DataAccess();
        da.put(error);
        
        log.info("Client Error\n" + error.getError() + "\n" + error.getInfo());
        return responseCreated(error.getId());
    }

}
