package ca.bc.mefm;

import javax.ws.rs.ForbiddenException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

/**
 * Handles CORS requests both preflight and simple CORS requests.
 * You must bind this as a singleton and set up allowedOrigins and other settings to use.
 *
 * @author <a href="mailto:bill@burkecentral.com">Bill Burke</a>
 * @version $Revision: 1 $
 */
@Provider
@PreMatching
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {

	public static final String ACCESS_CONTROL_ALLOW_CREDENTIALS   = "Access-Control-Allow-Credentials";
	public static final String ACCESS_CONTROL_ALLOW_HEADERS   = "Access-Control-Allow-Headers";
	public static final String ACCESS_CONTROL_ALLOW_METHODS   = "Access-Control-Allow-Methods";
	public static final String ACCESS_CONTROL_ALLOW_ORIGIN= "Access-Control-Allow-Origin";
	public static final String ACCESS_CONTROL_EXPOSE_HEADERS  = "Access-Control-Expose-Headers";
	public static final String ACCESS_CONTROL_MAX_AGE = "Access-Control-Max-Age";
	public static final String ACCESS_CONTROL_REQUEST_HEADERS = "Access-Control-Request-Headers";
	public static final String ACCESS_CONTROL_REQUEST_METHOD  = "Access-Control-Request-Method";
	public static final String ORIGIN = "Origin";
	public static final String VARY = "Vary";

	protected boolean allowCredentials = true;
	protected String allowedMethods;
	protected String allowedHeaders;
	protected String exposedHeaders;
	protected int corsMaxAge = -1;
	
	protected static Set<String> allowedOrigins;
	static {
		allowedOrigins = new HashSet<String>();
		allowedOrigins.add("*");		
	}
	/**
	 * Put "*" if you want to accept all origins.
	 * @return allowed origins
	 */
	public Set<String> getAllowedOrigins(){
		return allowedOrigins;
	}

	/**
	 * Defaults to true.    
	 * @return allow credentials
	 */
	public boolean isAllowCredentials(){
		return allowCredentials;
	}
	public void setAllowCredentials(boolean allowCredentials){
		this.allowCredentials = allowCredentials;
	}

	/**
	 * Will allow all by default.
	 * @return allowed methods
	 */
	public String getAllowedMethods(){
		return allowedMethods;
	}
	/**
	 * Will allow all by default comma delimited string for Access-Control-Allow-Methods.
	 * @param allowedMethods allowed methods
	 */
	public void setAllowedMethods(String allowedMethods){
		this.allowedMethods = allowedMethods;
	}   

	/**
	 * Will allow all by default comma delimited string for Access-Control-Allow-Headers.    *
	 * @param allowedHeaders allowed headers
	 */
	public void setAllowedHeaders(String allowedHeaders){
		this.allowedHeaders = allowedHeaders;
	}
	public String getAllowedHeaders(){
		return allowedHeaders;
	}

	public void setCorsMaxAge(int corsMaxAge){
		this.corsMaxAge = corsMaxAge;
	}
	public int getCorsMaxAge(){
		return corsMaxAge;
	}

	/**
	 * Comma delimited list.    *
	 * @param exposedHeaders exposed headers
	 */
	public void setExposedHeaders(String exposedHeaders){
		this.exposedHeaders = exposedHeaders;
	}
	public String getExposedHeaders(){
		return exposedHeaders;
	}

	@Override
	public void filter(ContainerRequestContext requestContext) throws IOException {
		String origin = requestContext.getHeaderString(ORIGIN);
		if (origin == null) {
			return;
		}
		if (requestContext.getMethod().equalsIgnoreCase("OPTIONS")){
			preflight(origin, requestContext);
		}
		else {
			checkOrigin(requestContext, origin);
		}
	}

	@Override
	public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
		String origin = requestContext.getHeaderString(ORIGIN);

		if (origin == null || requestContext.getMethod().equalsIgnoreCase("OPTIONS") 
				|| requestContext.getProperty("cors.failure") != null) {
			// don't do anything if origin is null, its an OPTIONS request, or cors.failure is set
			return;
		}
		responseContext.getHeaders().putSingle(ACCESS_CONTROL_ALLOW_ORIGIN, origin);
		responseContext.getHeaders().putSingle(VARY, ORIGIN);
		if (allowCredentials) responseContext.getHeaders().putSingle(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");

		if (exposedHeaders != null) {
			responseContext.getHeaders().putSingle(ACCESS_CONTROL_EXPOSE_HEADERS, exposedHeaders);
		}
	}

	protected void preflight(String origin, ContainerRequestContext requestContext) throws IOException {
		checkOrigin(requestContext, origin);

		Response.ResponseBuilder builder = Response.ok();
		builder.header(ACCESS_CONTROL_ALLOW_ORIGIN, origin);
		builder.header(VARY, ORIGIN);

		if (allowCredentials) {
			builder.header(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
		}

		String requestMethods = requestContext.getHeaderString(ACCESS_CONTROL_REQUEST_METHOD);
		if (requestMethods != null) {
			if (allowedMethods != null) {
				requestMethods = this.allowedMethods;
			}
			builder.header(ACCESS_CONTROL_ALLOW_METHODS, requestMethods);
		}

		String allowHeaders = requestContext.getHeaderString(ACCESS_CONTROL_REQUEST_HEADERS);
		if (allowHeaders != null) {
			if (allowedHeaders != null) {
				allowHeaders = this.allowedHeaders;
			}
			builder.header(ACCESS_CONTROL_ALLOW_HEADERS, allowHeaders);
		}

		if (corsMaxAge > -1) {
			builder.header(ACCESS_CONTROL_MAX_AGE, corsMaxAge);
		}
		requestContext.abortWith(builder.build());

	}

	protected void checkOrigin(ContainerRequestContext requestContext, String origin) {
		if (!allowedOrigins.contains("*") && !allowedOrigins.contains(origin)) {
			requestContext.setProperty("cors.failure", true);
			throw new ForbiddenException("Origin not allowed: " +origin);
		}
	}
}