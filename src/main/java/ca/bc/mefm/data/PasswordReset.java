package ca.bc.mefm.data;

import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class PasswordReset {
	@Id
	private Long			id;
	private Long			userId;
	@Index
	private String			code;
	private Long			created;
	
	public PasswordReset() {}
	
	public PasswordReset(Long userId, String code) {
		this.userId = userId;
		this.code = code;
		created = new Date().getTime();
	}
}
