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
accountName="cosmos-arowebappsexample" #needs to be lower case
serverVersion='3.6' #3.2 or 3.6
database='highscores'
collectionName='collection1'
#collectionName='scores'

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

# Define the index policy for the collection, include unique index and 30-day TTL
idxpolicy=$(cat << EOF 
[ 
    {
        "key": {"keys": ["user_id", "user_address"]}, 
        "options": {"unique": "true"}
    },
    {
        "key": {"keys": ["_ts"]},
        "options": {"expireAfterSeconds": 2629746}
    }
]
EOF
)
# Persist index policy to json file
echo "$idxpolicy" > "idxpolicy-$uniqueId.json"

# Create a MongoDB API collection
az cosmosdb mongodb collection create \
    -a $accountName \
    -g $resource \
    -d $database \
    -n $collectionName \
    --shard 'user_id' \
    --throughput 400 \
    --idx @idxpolicy-$uniqueId.json

# Clean up temporary index policy file
rm -f "idxpolicy-$uniqueId.json"

echo "Your connection strings are:"
az cosmosdb list-connection-strings -g $resource --name $accountName