#!/bin/bash
# Reference: az cosmosdb | https://docs.microsoft.com/cli/azure/cosmosdb
# --------------------------------------------------
#
# Create a MongoDB API database and collection
#
#
resource="rg-AroWebAppsExample"

uniqueId=$RANDOM
resource="rg-AroWebAppsExample"
location="East US"
accountName="cosmos-aromodernwebapps" #needs to be lower case
serverVersion='3.6' #3.2 or 3.6
database='highscores'
collectionName='scores'

# Create a resource group
az group create --name $resource --location "$location"

# Create a Cosmos account for MongoDB API
az cosmosdb create \
    -n $accountName \
    -g $resource \
    --kind MongoDB \
    --default-consistency-level Eventual \
    --locations regionName='East US' failoverPriority=0 isZoneRedundant=False \
    --locations regionName='East US 2' failoverPriority=1 isZoneRedundant=False

# Create a MongoDB API database
az cosmosdb mongodb database create \
    -a $accountName \
    -g $resource \
    -n $database

# Azure Cosmos DB's API for MongoDB server version 3.6+ automatically indexes 
# the _id field, which can't be dropped. It automatically enforces the uniqueness 
# of the _id field per shard key.

# Create a MongoDB API collection
az cosmosdb mongodb collection create \
    -a $accountName \
    -g $resource \
    -d $database \
    -n $collectionName \
    --shard '_id'

echo "Your connection strings are:"
az cosmosdb list-connection-strings -g $resource --name $accountName