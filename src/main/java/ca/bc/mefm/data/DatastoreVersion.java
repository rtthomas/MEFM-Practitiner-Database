package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Records the most recent version of the datastore.
 * @author Robert
 */
@Entity
@Data
@AllArgsConstructor
public class DatastoreVersion {
	@Id
	private Long	id;
	private String	version;
	
	public DatastoreVersion() {}
	
	public DatastoreVersion(String version) {
		this.version = version;
	}
}
