package ca.bc.mefm;

import java.util.List;
import java.util.Properties;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.Property;

/**
 * Singleton holding properties loaded from database Property entities
 * @author Robert
 *
 */
public class DatabaseProperties {

	private Properties	properties;
	
	private DatabaseProperties() {
		
        DataAccess da = new DataAccess();
        List<Property> asList = da.getAll(Property.class);
		properties = new Properties();
		asList.forEach( property -> {
			properties.setProperty(property.getKey(), property.getValue());
		});
	}

    private static class SingletonHelper{
        private static final DatabaseProperties INSTANCE = new DatabaseProperties();
    }
    
    public static Properties getProperties(){
        return SingletonHelper.INSTANCE.properties;
    }
    
    public static String get(String key) {
    	return (String)getProperties().get(key);
    }
}
