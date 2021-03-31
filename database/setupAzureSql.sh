#!/bin/bash
# Reference: az sql | https://docs.microsoft.com/en-us/cli/azure/sql?view=azure-cli-latest
# # --------------------------------------------------
#
# Create a Azure SQL database
#
resource="rg-AroWebAppsExample"
location="East US"
server="server-arowebappsexample"
database1="Microsoft.eShopOnWeb.CatalogDb"
database2="Microsoft.eShopOnWeb.Identity"
database3="databaase_name"

login="aroWebAppsExampleUser"
password="aroWebAppsExample-P4ssw0rd"

startIP=0.0.0.0
endIP=0.0.0.0

echo "Creating $resource..."
az group create --name $resource --location "$location"

echo "Creating $server in $location..."
az sql server create --name $server --resource-group $resource --location "$location" --admin-user $login --admin-password $password

echo "Configuring firewall..."
az sql server firewall-rule create --resource-group $resource --server $server -n AllowYourIp --start-ip-address $startIP --end-ip-address $endIP

echo "Creating $database on $server..."
az sql db create --resource-group $resource --server $server --name $database1 --service-objective S0
az sql db create --resource-group $resource --server $server --name $database2 --service-objective S0
#az sql db create --resource-group $resource --server $server --name $database --sample-name SampleName --edition GeneralPurpose --family Gen4 --capacity 1 --zone-redundant false # zone redundancy is only supported on premium and business critical service tiers

echo "Your connection strings for ADO.NET (aspdotnet app)"
az sql db show-connection-string --server $server --name $database1 -c ado.net
az sql db show-connection-string --server $server --name $database2 -c ado.net

echo "Your connection string for JDBC (java app)"
az sql db show-connection-string --server $server --name $database3 -c jdbc