package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class UserRole {
	public enum 	Type {ACTIVE, MODERATOR, ADMINISTRATOR, SUPPORT}

	@Id
	private Long	id;
	private Type	type;
	
	public UserRole() {}
}
