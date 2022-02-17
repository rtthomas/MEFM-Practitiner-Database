package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.AllArgsConstructor;
import lombok.Data;
/**
 * Records the versions of entity classes. For cities, the versions are 
 * further divided by province/territory 
 */
@Entity
@Data
@AllArgsConstructor
public class EntityVersion {
	
	@Id
	private Long	id;
	@Index
	private String	entityType;
	private String	version;
	
	public EntityVersion() {}
	public EntityVersion(String entityType, String version) {
		this.entityType = entityType;
		this.version = version;
	}
}

