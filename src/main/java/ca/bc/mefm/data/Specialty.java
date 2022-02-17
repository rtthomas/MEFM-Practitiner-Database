package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Defines a Practitioner specialty 
 * @author Robert
 */
@Entity
@Data
@AllArgsConstructor
public class Specialty {
	
	public static final String CONVENTIONAL = "Conventional Medicine";
	public static final String ALTERNATIVE = "Complementary & Alternative";
	
	@Id
	private Long	id;
	private String	text;
	private String 	group;
	
	public Specialty() {}
}
