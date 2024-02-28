const { getMongoClient, jsonParser, checkCollectionExistsAsync, displayMenu, displayAllData, addDataToDB, dropCollections } = require('./help_functions');

async function main() {

  try {
    const authInfoPath = './schema.json';
    const collectionName = 'currency_data';
	const schemaPath = './schema.json';
	const dataJSONPath = './merged_json.json';
	
	// Parse the JSON data for the schema
    const schema = await jsonParser(schemaPath);
		
	//Get the Mongo client
	//TO-DO add the schema validation or why it is failing below?
    var {collectionsRef, mongoDBClient} = await getMongoClient(collectionName, authInfoPath, schema);
	
	// Parse the JSON data for the collection
	const currencyDataJSON = await jsonParser(dataJSONPath);
		
	if(await checkCollectionExistsAsync(collectionsRef, collectionName, schema)){
		await dropCollections(collectionsRef, collectionName);
	}	
	
	await addDataToDB(collectionsRef, collectionName, schema, currencyDataJSON);

	// Display all data in the collection
    await displayAllData(collectionsRef, collectionName);
	
	//confirm this works!!
	await dropCollections(collectionsRef, collectionName);
	await mongoDBClient.close();
	

  } catch (err) {
	  console.error('Error displaying data:', err.message || err);
	  
  }
  //TO-DO close gracefull the mongo connection
  //await mongoDBClient.close();
  process.exit();

    
}

main();





