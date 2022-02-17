package ca.bc.mefm.resource;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Province;

/**
 * Service endpoint for Province entity retrieval. 
 * @author Robert
 */
@Path("/provinces")
public class ProvinceResource extends AbstractResource  {
    /**
     * Fetches all Province entities
     * @return list of Provinces
     */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProvinces(){
        DataAccess da = new DataAccess();
        List<Province> list = da.getAll(Province.class);
        return responseOkWithBody(list);
    }

}
