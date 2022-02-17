package ca.bc.mefm.data;

import java.util.Date;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import lombok.Data;

@Entity
@Data
public class ErrorLog {
	@Id
	private Long	id;
	private Date	timestamp;
	private String	error;
	private String	info;
}
