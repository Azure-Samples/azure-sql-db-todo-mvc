# Modern Web App
This example app is a 2 part GUI and api service. The API service stores data in a Azure NoSQL database (Cosmos DB).

`/api` - a Quarkus Java app exposing an API and storing data into a Azure CosmosDB (a non-relational database)
`/ui` - a Phaser UI that talks to the API service and displays the data in a pretty way

References:
* https://quarkus.io/
* https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction
