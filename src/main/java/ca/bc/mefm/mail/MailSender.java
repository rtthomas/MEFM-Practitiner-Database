package ca.bc.mefm.mail;

import java.io.UnsupportedEncodingException;
import java.text.MessageFormat;
import java.util.Date;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import ca.bc.mefm.ApplicationProperties;
import ca.bc.mefm.data.Practitioner;
import ca.bc.mefm.data.User;
import ca.bc.mefm.resource.CommentResource;

/**
 * Methods to send email messages for comment creation/flagging/blocking, password reset, and support requests. 
 * @author Robert
 */
public class MailSender {

	private static final Logger log = Logger.getLogger(MailSender.class.getName());
	private static final String noReplyAddress = ApplicationProperties.get("email.address.noreply");
	
	/**
	 * Sends a message to user who created a comment which have been blocked
	 * @param moderatorAddress
	 * @param blockedComment
	 */
	public static void sendBlockedNotification(String moderatorAddress, CommentResource.CommentWrapper wrapper) {
		
		final Address[] replyTo;
		try {
			replyTo = new Address[]{new InternetAddress(moderatorAddress, "MEFM Society Moderator")};
		}
		catch (UnsupportedEncodingException e) {
			log.severe("Error creating replyto address"  + "\n" + e);
			return;
		}
		String template = ApplicationProperties.get("email.blocked.message");
		
		// Insert username and practitioner name into the message
		User user = wrapper.getUser();
		String text = wrapper.getComment().getText();
		if (text.length() > 20) {
			text = text.substring(0, 20);
		}
		Date date = new Date(wrapper.getComment().getDate());
		
		String message = MessageFormat.format(template, 
				user.getUsername(),
				wrapper.getPractitioner().getFirstName() + " " + wrapper.getPractitioner().getLastName(),
				date,
				text);
		try {
			sendMessage(
					new InternetAddress(noReplyAddress, "HealthFinder4ME Moderator"), 
					new InternetAddress(user.getEmail()), 
					ApplicationProperties.get("email.blocked.subject"), 
					message,
					replyTo);
			log.info("Sent blocked comment notification to " + user.getEmail());
		} 
		catch (MessagingException | UnsupportedEncodingException e) {
			log.severe("Bad address for user " + user.getUsername() + "\n" + e);
		} 
	}
	
	/**
	 * Sends a message to the moderator when a comment is either posted or flagged
	 * @param moderatorAddress
	 * @param blockedComment
	 */
	public static void sendCommentNotification(String moderatorAddress, CommentResource.CommentWrapper wrapper, String reason) {

		final String logTemplate = "Sent comment {0} email to {1} moderator";
		final String commentTemplate = "Comment text: {0}";

		Practitioner practitioner = wrapper.getPractitioner();
		
		String subject = MessageFormat.format(
			ApplicationProperties.get("email.comment.subject"),
			wrapper.getUser().getUsername(),
			practitioner.getFirstName(),
			practitioner.getLastName(),
			reason);

		try {
			sendMessage(
				new InternetAddress(noReplyAddress, "HealthFinder4ME Application"), 
				new InternetAddress(moderatorAddress), 
				subject, 
				MessageFormat.format(commentTemplate, wrapper.getComment().getText()),
				null);
			log.info(MessageFormat.format(logTemplate, reason, practitioner.getProvince()));
		} 
		catch (MessagingException | UnsupportedEncodingException e) {
			log.severe("Unable to send comment notification to " + moderatorAddress + "\n" + e);
		} 
	}
	
	/**
	 * Sends a password reset code
	 * @param user the user requesting the password reset
	 * @param code the reset code
	 */
	public static void sendPasswordResetCode(User user, String code) {

		try {
			String message = "Your username is '" + user.getUsername() 
			+ "'. On the Recover Password page, enter this code: "  + code;
			
			sendMessage(
					new InternetAddress(noReplyAddress, "HealthFinder4ME"), 
					new InternetAddress(user.getEmail()), 
					"MEFM Database Password Reset", 
					message,
					null);

			log.info("Sent password reset code to " + user.getEmail());
		} 
		catch (MessagingException | UnsupportedEncodingException e) {
			log.severe("Bad address for user " + user.getUsername() + "\n" + e);
		} 
	}
	
	/**
	 * Sends a support request message
	 * @param user the user making the support request
	 * @param message the request message
	 */
	public static void sendSupportRequest(User user, String message) {

		final Address[] replyTo;
		try {
			replyTo = new Address[]{new InternetAddress(user.getEmail(), user.getUsername())};
		}
		catch (UnsupportedEncodingException e) {
			log.severe("Error creating reply to address"  + "\n" + e);
			return;
		}
		try {
			sendMessage(
					new InternetAddress(noReplyAddress, "HealthFinder4ME"), 
					new InternetAddress(ApplicationProperties.get("email.address.support")), 
					"Support Request", 
					message,
					replyTo);

			log.info("Sent support request from " + user.getEmail() + " to " + ApplicationProperties.get("email.address.support"));
		} 
		catch (MessagingException | UnsupportedEncodingException e) {
			log.severe("Bad address for user " + user.getUsername() + "\n" + e);
		} 
	}
	
	private static void sendMessage(InternetAddress from, InternetAddress to, String subject, String message, Address[] replyTo) 
		throws MessagingException, UnsupportedEncodingException {
		
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);

		Message msg = new MimeMessage(session);
		msg.setFrom(from);
		msg.addRecipient(Message.RecipientType.TO, to);
		msg.setSubject(subject);
		msg.setText(message);
		
		if (replyTo != null) {
			msg.setReplyTo(replyTo);
		}		
		Transport.send(msg);
	}
}
