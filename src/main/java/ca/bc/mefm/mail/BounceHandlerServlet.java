package ca.bc.mefm.mail;

import com.google.appengine.api.mail.BounceNotification;
import com.google.appengine.api.mail.BounceNotificationParser;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.logging.Logger;
import java.util.logging.Level;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class BounceHandlerServlet extends HttpServlet {

    private static final Logger log = Logger.getLogger(BounceHandlerServlet.class.getName());

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            BounceNotification bounce = BounceNotificationParser.parse(req);
            String from = bounce.getOriginal().getFrom();
            String to = bounce.getOriginal().getTo() ;
            String subject = bounce.getOriginal().getSubject();
            
            String s = MessageFormat.format("Bounced message from {0} to {1} subject '{2}'", from, to, subject);
            log.log(Level.WARNING, s);
        }
        catch (MessagingException e) {
            log.severe("BounceHandlerServlet " + e);
        }
    }
}
