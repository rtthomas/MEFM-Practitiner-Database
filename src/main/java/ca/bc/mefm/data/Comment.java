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
public class Comment {

	public enum 	Status {PENDING, MODERATED, FLAGGED, BLOCKED}

	@Id
	private Long	id;
	@Index 
	private Long	parentId;	
	@Index 
	private Long	userId;
	@Index 
	private Long	practitionerId;
	private Long	date;
	private String	text;
	@Index
	private Status  status;
	
	public Comment() {}
}
