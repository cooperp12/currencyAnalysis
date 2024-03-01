# Currency Data Management System

This project provides a solution for managing currency data within a MongoDB database. It includes functionality for parsing JSON data, setting up database connections, adding data to the database, dropping collections, checking for the existence of collections, and displaying data from the database.

This branch adds TypeScript, while the previous main branch was pure Javascript.

## Features

- **JSON Parsing**: Utilize `jsonParser` to parse JSON files for schema and data.
- **Database Setup**: Establish a connection to MongoDB and prepare collections with `getMongoClient`.
- **Data Management**: Add data to the database with `addDataToDB`, check for existing collections with `checkCollectionExistsAsync`, and drop collections if necessary using `dropCollections`.
- **Data Display**: Query and display data from the database using `displayAllData`.

## Getting Started

### Prerequisites

- MongoDB installed and running on your system.
- Node.js and npm installed.

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone git@github.com:cooperp12/currencyAnalysis.git
   ```
2. Navigate to the project directory:
   ```bash
   cd currencyAnalysis
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Format the TypeScript files (optional):
   ```bash
   npx prettier --write "**/*.ts"
   ```

## Usage

1. Compile the TypeScript files:
   ```bash
   tsc -p tsconfig.json
   ```
2. Run the main script:
   ```bash
   node dist/src/main.js
   ```
   This will initiate the process to parse JSON data, interact with MongoDB, and perform the specified data management tasks.

## Functionality Overview

- `jsonParser`: Parses JSON files to extract the schema or data.
- `getMongoClient`: Connects to MongoDB and sets up the specified collection using the provided schema.
- `addDataToDB`: Adds currency data to the specified MongoDB collection.
- `dropCollections`: Drops the specified collection from MongoDB if it exists.
- `checkCollectionExistsAsync`: Checks if the specified collection exists in MongoDB.
- `displayAllData`: Displays all or specific data from the MongoDB collection based on the provided criteria.
