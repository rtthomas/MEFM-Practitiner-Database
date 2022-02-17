package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Practitioner {
	
	@Id
	private Long	id;
	@Index
	private String 	lastName;
	@Index
	private String 	firstName;
	private String 	address;
	@Index
	private String 	city;
	@Index
	private String  province;
	private String 	country;
	private String 	postalCode;
	private String 	phone;
	private String	website;
	@Index
	private Long 	specialtyId;
	private Long	creationDate;
	private Long	editDate;

	public Practitioner() {}
	
}
