package ca.bc.mefm.security;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;

/**
 * An annotation which will enforce validation of a JSON Web Token (JWT) in
 * requests to REST end-point methods decorated with the annotation.
 * @author Robert
 *
 */
@javax.ws.rs.NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface JWTTokenNeeded {
}