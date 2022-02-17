package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.Data;

/**
 * A property key-value pair seeded in the database
 */
@Entity
@Data
public class Property {
	@Id
	private Long	id;
	private String	key;
	private String	value;

}
