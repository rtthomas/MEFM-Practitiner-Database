package ca.bc.mefm;

import java.util.Arrays;
import java.util.List;

import ca.bc.mefm.data.DataAccess;
import ca.bc.mefm.data.DatastoreVersion;
import ca.bc.mefm.data.EntityVersion;

public class VersionManager {
	
	public static final String[] replaceableEntityTypes = {
		"Question",
		"QuestionChoice",
		"QuestionGroup",
		"Specialty",
        "City",
	};
	
	/**
	 * Checks if the database contains the entity version records. If not, initialize then all to zero
	 */
	public static void checkAndInitialize() {
		DataAccess da = new DataAccess();
		if (da.getAll(EntityVersion.class).isEmpty()) {
			Arrays.asList(replaceableEntityTypes).forEach(entityType -> {
				da.put(new EntityVersion(entityType, "0"));
			});
		}
	}
	
	/**
	 * For each of a specified set of entity types, create or update their EntityVersion version value 
	 * @param newVersion the version
	 * @param entitiesToReplace list of entity types
	 */
	public static void updateVersions(String newVersion, String[] entityTypes) {
		DataAccess da = new DataAccess();
		Arrays.asList(entityTypes).forEach( entityType -> {
			EntityVersion ev = da.findByQuery(EntityVersion.class, "entityType", entityType);
			if (ev == null) {
				ev = new EntityVersion(entityType, newVersion);
			}
			else {
				ev.setVersion(newVersion);
			}
			da.put(ev);
		});
		
		List<DatastoreVersion> dsvList = da.getAll(DatastoreVersion.class);
		DatastoreVersion dsv = null;
		if (dsvList == null || dsvList.size() == 0) {
			dsv = new DatastoreVersion(newVersion);
		}
		else {
			dsv = dsvList.get(0);
			dsv.setVersion(newVersion);
		}
		da.put(dsv);
	}
	
	/** Returns true if a specified version of a specified entity type is the current one */
	public static boolean isEntityVersionCurrent(String entityType, String version) {
		DataAccess da = new DataAccess();
		EntityVersion entityVersion = da.findByQuery(EntityVersion.class, "type", entityType);
		if (entityVersion == null) {
			// No previous entity type versioning
			EntityVersion initialVersion = new EntityVersion(entityType, "0");
			da.put(initialVersion);
			return false;
		}
		else {
			return entityVersion.getVersion() == version;
		}
	}
	
	/** Returns true if the database has been previously populated */
	public static boolean isPopulated() {
		DataAccess da = new DataAccess();
		return !da.getAll(DatastoreVersion.class).isEmpty();
	}
	
	/** Returns true if a specified database version is the current one */
	public static boolean isDatastoreVersionCurrent(String newVersion) {
		DataAccess da = new DataAccess();
		String currentVersion = da.getAll(DatastoreVersion.class).get(0).getVersion();
		return currentVersion.equals(newVersion);
	}
}
