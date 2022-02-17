package ca.bc.mefm.data;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.Data;

@Entity
@Data
public class RecommendationAction {
	
	public enum 	ActionType {CREATE, EDIT, RATE, COMMENT}

	@Id
	private Long		id;
	@Index 
	private Long		practitionerId;
	@Index 
	private Long		userId;
	private Long		questionId;
	private ActionType	actionType;
	private Integer		value;
	private Long		date;

	public RecommendationAction() {}
	
	public RecommendationAction(Long userId, Long practitionerId, Long date, ActionType type) {
		this.userId = userId;
		this.practitionerId = practitionerId;
		this.date = date;
		this.actionType = type;
	}
}
