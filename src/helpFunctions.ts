import { readFileSync } from 'fs'

const fs = {
	readFileSync: readFileSync,
}

export async function jsonParser(schemaPath: string) {
	// Read the content of the JSON file
	const data = fs.readFileSync(schemaPath, 'utf8')

	// Parse the JSON data
	const schema = JSON.parse(data)

	return schema
}
