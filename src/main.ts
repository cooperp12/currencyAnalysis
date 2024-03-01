import { jsonParser } from './helpFunctions'
import { getMongoClient } from './setUpMongo'
import { addDataToDB } from './addToDatabase'
import { dropCollections } from './dropCollections'
import { checkCollectionExistsAsync } from './checkCollectionExists'
import { displayAllData } from './displayAllData'

async function main() {
	try {
		const authInfoPath = './schema.json'
		const collectionName = 'currency_data'
		const schemaPath = './schema.json'
		const dataJSONPath = './merged_json.json'

		// Parse the JSON data for the schema
		const schema = await jsonParser(schemaPath)

		console.log(schema)

		// Get the reference to currency_collection and mongoClient
		const { collectionsRef, mongoDBClient } = await getMongoClient(
			collectionName,
			authInfoPath,
			schema
		)

		// Parse the JSON data for the collection
		const currencyDataJSON = await jsonParser(dataJSONPath)

		// Check if data is in the database
		if (
			await checkCollectionExistsAsync(
				collectionsRef,
				collectionName,
				schema
			)
		) {
			await dropCollections(collectionsRef, collectionName)
		}

		await addDataToDB(
			collectionsRef,
			collectionName,
			schema,
			currencyDataJSON
		)

		// Commented out as it provides too much output on the console for now
		//await displayAllData(collectionsRef, collectionName);
		await displayAllData(collectionsRef, collectionName, '2008-10-28')

		if (
			await checkCollectionExistsAsync(
				collectionsRef,
				collectionName,
				schema
			)
		) {
			await dropCollections(collectionsRef, collectionName)
		}

		// Close the MongoDB client, as we cannot do close on collectionsRef
		await mongoDBClient.close()
	} catch (error) {
		console.error(
			'Error!',
			((error as Error).message ?? 'Unknown error') as string
		)
	}

	process.exit()
}

//Compile and run with: tsc -p tsconfig.json && node dist\src\main.js
main()

//npx prettier --write "**/*.ts"
