package ca.bc.mefm.security;

import java.io.IOException;
import java.security.Key;

import javax.annotation.Priority;
import javax.ws.rs.ext.Provider;

import io.jsonwebtoken.Jwts;

import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

/**
 * This filter validates a JSON Web Token (JWT) in a request header. 
 * It is bound to the JWTTokenNeeded annotation. As such, the filter is invoked only
 * if the request is for a JAX-RS endpoint method decorated with the annotation.
 *   
 * @author Robert
 */
@Provider
@JWTTokenNeeded
@Priority(Priorities.AUTHENTICATION)
public class JWTTokenNeededFilter implements ContainerRequestFilter {
	 
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
 
        // Get the HTTP Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // Extract the token from the HTTP Authorization header
        String token = authorizationHeader.substring("Bearer".length()).trim();
 
        try { 
            // Validate the token
            Key key = KeyGenerator.getKey();
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
        } 
        catch (Exception e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        }
    }
}