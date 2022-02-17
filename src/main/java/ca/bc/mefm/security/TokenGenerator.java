package ca.bc.mefm.security;

import java.security.Key;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class TokenGenerator {

    public static String generateToken(String username, String roleName, Long id, Long lastLogin) {
        Key key = KeyGenerator.getKey();
        
//        Calendar calendar = new GregorianCalendar();
//        calendar.add(Calendar.DAY_OF_YEAR, 30);
//        Date expiry = calendar.getTime();
        
        String jwtToken = Jwts.builder()
                .claim("username", username)
                .claim("role", roleName)
                .claim("id", id)
                .claim("lastLogin", lastLogin)
                .signWith(SignatureAlgorithm.HS512, key)
                .compact();
        
        return jwtToken;
    }


}
