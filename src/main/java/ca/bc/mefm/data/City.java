package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.Data;

@Entity
@Data
public class City {
	@Id
	private Long	id;
	@Index 
	private Long	provinceId;
	private String	name;
	
	public City() {}
	
	public City(Long provinceId, String name) {
		this.provinceId = provinceId;
		this.name = name;
	}
}
