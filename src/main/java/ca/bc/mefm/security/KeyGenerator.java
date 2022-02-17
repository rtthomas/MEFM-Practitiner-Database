package ca.bc.mefm.security;

import java.security.Key;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Holds the asymetric key used to sign the JSON Web Tokens
 * Uses the "Bill Pugh" singleton pattern
 * https://www.journaldev.com/1377/java-singleton-design-pattern-best-practices-examples#bill-pugh-singleton
 *
 */
public class KeyGenerator {
	
	private Key	key;
	
	private KeyGenerator() {
		key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
	}

    private static class SingletonHelper{
        private static final KeyGenerator INSTANCE = new KeyGenerator();
    }
    
    public static Key getKey(){
        return SingletonHelper.INSTANCE.key;
    }
}
