package ca.bc.mefm.resource;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Specialty;

/**
 * Service endpoint for retrieval of Specialty entities.
 * Creation of new entities is not yet supported 
 * @author Robert
 */
@Path("/specialties")
public class SpecialtiesResource extends AbstractResource{

	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        DataAccess da = new DataAccess();
        List<Specialty> list = da.getAll(Specialty.class);
        return responseOkWithBody(list);
    }
}
