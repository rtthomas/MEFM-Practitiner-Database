package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Question {
	public enum Type {YES_NO, SINGLE_CHOICE}
	
	@Id
	private Long	id;	
	private Integer	displayIndex;
	private Long	questionChoiceSetId;
	private Long 	questionGroupId;
	private Type	type;
	private String	text;

	public Question() {}
}
