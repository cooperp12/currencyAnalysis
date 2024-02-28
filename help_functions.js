const { MongoClient } = require('mongodb');
const fs = require('fs');
const { Decimal128 } = require('mongodb');


const monthNames = {
  1: 'January', 2: 'February', 3: 'March',
  4: 'April', 5: 'May', 6: 'June', 7: 'July',
  8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December',
};

module.exports = {
  getMongoClient,
  jsonParser,
  jsonSchemaValidator,
  addDataToDB,
  dropCollections,
  checkCollectionExistsAsync,
  countCollectionObj,
  loadSchema,
  displayAllData
};



async function getMongoClient(collectionName, authInfoPath, schema) {
  try {
    // Read the content of the JSON file
    let data = fs.readFileSync(authInfoPath, 'utf8');

    // Parse the JSON data
    const authInfo = JSON.parse(data);
    
    const json_data = fs.readFileSync('auth.json', 'utf8');
    data = JSON.parse(json_data);

    const uri = `mongodb+srv://${encodeURIComponent(data.username)}:${encodeURIComponent(data.password)}@${data.cluster}/?retryWrites=true&w=majority&appName=Cluster0`;

    const MongoClient = require('mongodb').MongoClient;
	
	//TO-DO check if the database is not empty or else it will fail when creating another collection

    // Include the schema when creating the client
    const mongoDBClient = await MongoClient.connect(uri);
    const collectionsRef = mongoDBClient.db(collectionName);
	
    await collectionsRef.createCollection(collectionName, {
        validator: schema, // Remove $jsonSchema
     });
	 
	 console.log("Schema: ");
	 console.log(schema);
	 const collectionInfos = await collectionsRef.listCollections({ name: collectionName }).toArray();

	console.log("From MongoDB: (creation)")
	if (collectionInfos.length > 0) {
	  const existingSchema = collectionInfos[0].options && collectionInfos[0].options.validator;
	  console.log(existingSchema);
	} else {
	  console.log(`The collection ${collectionName} does not exist!`);
	}


    return {collectionsRef, mongoDBClient};
  } catch (err) {
    console.error(`Unable to connect to the server: ${err}`);
    throw err;
  }
}

function jsonSchemaValidator(document, schema) {
  return function validator(document) {
    try {
      bson.validateJson(schema, document);
    } catch (e) {
      return JSON.stringify(e.details, null, 4);
    }
  };
}

async function jsonParser(schemaPath) {
    // Read the content of the JSON file
    const data = fs.readFileSync(schemaPath, 'utf8');

    // Parse the JSON data
    const schema = JSON.parse(data);

    return schema;
}

async function addDataToDB(db, collectionName, schema, data) {
  const validData = [];

  console.log("Collection Name: " + collectionName);


  for (const currencyObject of data) {
    try {
      if (!currencyObject.CurrencyCode) {
        console.log('CurrencyCode is missing in one of the objects in the data array.');
        continue;
      }

      // Convert the Date string to a Date object
      currencyObject.Date = new Date(currencyObject.Date);

      // Convert the currency data to Decimal128 objects
      const currencyData = {};
      for (const [currency, data] of Object.entries(currencyObject.CurrencyCode)) {
        currencyData[currency] = {
          AUDPerUnit: Decimal128.fromString(data.AUDPerUnit.toString()),
          UnitsPerAUD: Decimal128.fromString(data.UnitsPerAUD.toString()),
        };
      }
      currencyObject.CurrencyCode = currencyData;

      // Validate the data against the schema
      if (jsonSchemaValidator(currencyObject, schema)) {
        validData.push(currencyObject);
      } else {
        console.log('One of the objects in the data array did not pass validation against the schema.');
      }
    } catch (error) {
      console.error('Error processing data:', error.message || error);
    }
  }
  

  if (validData.length > 0) {
    try {
      // Insert the valid data into the MongoDB collection
      const result = await db.collection(collectionName).insertMany(validData);
      console.log(`${result.insertedCount} documents inserted successfully.`);
    } catch (error) {
      console.error('Error inserting data into the database:', error.message || error);
    }
  } else {
    console.log('No valid data to insert into the database.');
  }
}


async function dropCollections(db, collectionName) {
  try {
    const currencyDataCollection = db.collection(collectionName);

    if (!db.listCollections({ name: collectionName }).next()) {
      console.log('The collection does not exist.');
      return;
    }

    if ((await currencyDataCollection.countDocuments({})) === 0) {
      console.log('The collection is empty.');
      console.log('Dropping the collection now!');
      await currencyDataCollection.drop();
	  return;
    } else {
      await currencyDataCollection.drop();
      console.log('The collection has been deleted.');
	  return;
    }
  } catch (error) {
    console.error('Error:', error.message);
	return;
  }
}



async function checkCollectionExistsAsync(db, collectionName, expectedSchema) {
  try {
    const collection = db.collection(collectionName);
    const firstDocument = await collection.findOne({});

    if (!firstDocument || Object.keys(firstDocument).length === 0) {
      console.log(`The collection ${collectionName} does not exist or is empty!`);
      return false;
    } else {
	console.log(`The collection ${collectionName} exists and has at least one record!`);
	  return true;
    }
  } catch (error) {
    console.error(`Error checking collection: ${error}`);
    return false;
  }
}


function countCollectionObj(db) {
  const count = db.countDocuments({});
  console.log(`There are ${count} objects in the 'currency_data' collection.`);
}

function loadSchema(schemaFile) {
  const schemaData = fs.readFileSync(schemaFile, 'utf8');
  return JSON.parse(schemaData);
}

async function displayAllData(db, collectionName) {
  try {
    const collection = db.collection(collectionName);
    const allData = await collection.find({}).toArray();

    console.log('All Data in the Collection:');
    console.log(allData);
  } catch (error) {
    console.error('Error displaying data:', error.message || error);
  }
}
