package ca.bc.mefm.resource;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.City;
import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Moderator;
import ca.bc.mefm.data.Province;

/**
 * Service endpoint for City entity retrieval. Only cities for which moderators exist
 * @author Robert
 */
@Path("/cities")
public class CityResource extends AbstractResource  {
	
	private static final Logger log = Logger.getLogger(CityResource.class.getName());

	/**
     * Fetches all City entities in provinces for which a moderator is defined
     * @return list of Cities
     */
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCities(){
		DataAccess da = new DataAccess();
		List<Moderator> moderators = da.getAll(Moderator.class);

		if (moderators.size() == 0) {
			log.info("No provinces have moderators");
			return this.responseNoContent();
		}
		else {
			Set<Long> provinceIds = new HashSet<Long>();
			moderators.forEach(moderator -> {
				String provinceName = moderator.getProvince();
				log.info("Moderator " + provinceName);
				Province province = da.findByQuery(Province.class, "name", provinceName);
				provinceIds.add(province.getId());
			});
			List<City> cities = da.getAll(City.class)
					.stream()
					.filter(city -> {
						return provinceIds.contains(city.getProvinceId());
					})
					.collect(Collectors.toList());
			return responseOkWithBody(cities);
		}
    }
}
