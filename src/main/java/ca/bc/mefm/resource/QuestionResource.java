package ca.bc.mefm.resource;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import ca.bc.mefm.data.QuestionChoice;
import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Question;
import ca.bc.mefm.data.QuestionGroup;

/**
 * Service endpoint for Question, QuestionGroup and QuestionChoice entity retrieval. 
 * Creation of entities is not yet supported
 * @author Robert
 */
@Path("")
public class QuestionResource extends AbstractResource{

    /**
     * Fetches all Question entities
     * @return
     */
    @Path("/questions")
	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllQuestions(){
        DataAccess da = new DataAccess();
        List<Question> list = da.getAll(Question.class);
        return responseOkWithBody(list);
    }

    /**
     * Fetches all QuestionSet entities
     * @return
     */
    @Path("/questiongroups")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllQuestionSets(){
        DataAccess da = new DataAccess();
        List<QuestionGroup> list = da.getAll(QuestionGroup.class);
        return responseOkWithBody(list);
    }

    /**
     * Fetches all QuestionChoice entities
     * @return
     */
    @Path("/questionchoices")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllQuestionChoices(){
        DataAccess da = new DataAccess();
        List<QuestionChoice> list = da.getAll(QuestionChoice.class);
        return responseOkWithBody(list);
    }
}
