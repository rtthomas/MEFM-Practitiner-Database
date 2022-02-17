package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class User {
	public enum Status {ENABLED, SUSPENDED};
	
	@Id
	private Long			id;
	@Index
	private String 			username;
	private String 			password;
	@Index
	private String 			email;
	private UserRole.Type	role;
	private Long			created;
	private Status			status;
	private Long			lastLogin;
	
	public User() {}
	
	/** Clears the password TODO Review in security implementation */
	public User withoutPassword () {
		password = null;
		return this;
	}
}
