package ca.bc.mefm.resource;

import java.util.List;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

/**
 * Base class for all resource classes ("*Resource"), providing common methods
 * for response creation
 */
public abstract class AbstractResource {

	private static String contentLocation;
	
	protected static final void setCreatePath(String path) {
		contentLocation = "/" + path + "/";
	};
    
    /**
     * Generates a normal return (200 Ok) with a body
     * @param body object to be placed in the response body
     * @return  the Response
     */
    protected Response responseOkWithBody(Object body){
    	Response.ResponseBuilder builder = Response.ok(body);
    	builder.header("Access-Control-Allow-Origin", "*");
    	return builder.build();
     }

    /**
     * Creates a 201 Created response with the key as body content and an Authorization header
     * @param key the key
     * @param token the token to be returned in the Authorization header
     * @return the Response
     */
    protected Response responseCreated(Long id, String token){
    	ResponseBuilder builder = Response.status(Response.Status.CREATED);
    	builder.header("Access-Control-Allow-Origin", "*");
    	builder.header("Content-Location", contentLocation);
    	builder.header(HttpHeaders.AUTHORIZATION, "Bearer " + token);
    	builder.entity(id);
    	return builder.build();
    }
    
    /**
     * Creates a 201 Created response with the key as body content
     * @param key the key
     * @return the Response
     */
    protected Response responseCreated(Long id){
    	ResponseBuilder builder = Response.status(Response.Status.CREATED);
    	builder.header("Access-Control-Allow-Origin", "*");
    	builder.header("Content-Location", contentLocation);
    	builder.entity(id);
    	return builder.build();
    }
    
    /**
     * Creates a 201 Created response with an array of keys as body content
     * @param key the key
     * @return the Response
     */
    protected Response responseCreated(List<Long> ids){
    	ResponseBuilder builder = Response.status(Response.Status.CREATED);
    	builder.header("Access-Control-Allow-Origin", "*");
    	builder.header("Content-Location", contentLocation);
    	builder.entity(ids);
    	return builder.build();
    }
    
    /**
     * Creates a 201 Created response with no body 
     * @return the Response
     */
    protected Response responseCreated(){
    	ResponseBuilder builder = Response.status(Response.Status.CREATED);
    	builder.header("Access-Control-Allow-Origin", "*");
    	return builder.build();
    }

    /**
     * Creates a 204 No Content response with no body 
     * @return the Response
     */
    protected Response responseNoContent(){
    	ResponseBuilder builder = Response.status(Response.Status.NO_CONTENT);
    	builder.header("Access-Control-Allow-Origin", "*");
    	return builder.build();
    }
    
    /**
     * Creates a 400 Bad Request Error response  
     * @return the Response
     */
    protected Response responseBadRequest(String message){
    	ResponseBuilder builder = Response.status(Response.Status.BAD_REQUEST)
    		.entity(message);
    	return builder.build();
    }

    /**
     * Creates a 500 Internal Server Error response with no body 
     * @return the Response
     */
    protected Response responseError(){
    	ResponseBuilder builder = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
    	return builder.build();
    }

    /**
     * Creates a 501 Not Implemented response with no body 
     * @return the Response
     */
    protected Response responseNotImplemented(){
    	ResponseBuilder builder = Response.status(Response.Status.NOT_IMPLEMENTED);
    	return builder.build();
    }

}