package ca.bc.mefm;

import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Singleton holding application properties from the application.properties file
 * @author Robert
 *
 */
public class ApplicationProperties {

	private static final Logger log = Logger.getLogger(ApplicationProperties.class.getName());
	
	private Properties	properties;
	
	private ApplicationProperties() {
		InputStream is = this.getClass().getClassLoader().getResourceAsStream("application.properties");
		properties = new Properties();
		try {
			properties.load(is);
		}
		catch (Exception e) {
			log.severe("Unable to load application.properties file " + e);
		}
	}

    private static class SingletonHelper{
        private static final ApplicationProperties INSTANCE = new ApplicationProperties();
    }
    
    public static Properties getProperties(){
        return SingletonHelper.INSTANCE.properties;
    }
    
    public static String get(String key) {
    	return (String)getProperties().get(key);
    }
}
