package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Moderator {
	public enum Status {ENABLED, SUSPENDED};

	@Id
	private Long	id;
	@Index 
	private Long	userId;
	@Index 
	private String	province;
	private Status	status;
	
	public Moderator() {}
}
