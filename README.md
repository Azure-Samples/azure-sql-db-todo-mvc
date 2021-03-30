# DRAFT UNDER CONSTRUCTION

# OpenShift Examples - ARO WebApp with Azure SQL
A demo reference to deploying webapps in Azure Red Hat OpenShift that talk to Azure SQL. 
## Implementation Details

Folder structure:

- `/modern-app`: a modern backend API (supporting OpenAPI) and a webpacked frontend UI
- `/traditional-appserver`: the config and code for the traditional app server
- `/database`: the scripts needed to setup the Azure SQL database
- `/caching`: how to setup a caching service running in ARO
  
## Setup Databases
```
az cosmosdb mongodb mongodb database create -g <resource-group> -a <account-name> -n highscores
```

```
az sql db create -g <resource-group> -s <server-name> -n resiliency_test --service-objective S0
```

Execute the `/database/create-todos.sql` script on a database of your choice. Could be a local SQL Server or an Azure SQL running in the cloud. Just make sure the desired database is reachable by your local machine (eg: firewall, authentication and so on), then use SQL Server Management Studio or Azure Data Studio to run the script. 

If you need any help in executing the SQL script on Azure SQL, you can find a Quickstart here: [Use Azure Data Studio to connect and query Azure SQL database](https://docs.microsoft.com/en-us/sql/azure-data-studio/quickstart-sql-database).

If you prefer to do everything via the portal, here's a tutorial: [Create an Azure SQL Database single database](https://docs.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal).

If you are completely new to Azure SQL, no worries! Here's a full playlist that will help you: [Azure SQL for beginners](https://www.youtube.com/playlist?list=PLlrxD0HtieHi5c9-i_Dnxw9vxBY-TqaeN).

## Deploy Apps
1. If you haven't already, in your Azure account [create an ARO cluster](https://docs.microsoft.com/en-us/azure/openshift/tutorial-create-cluster)
2. If you haven't already, clone this github repo to your local machine (this is so you can tweak things before you deploy)
3. Login to ARO and create a new project to deploy this example (you can do via webconsole or CLI:`oc new-project`)
4. TBD - Deploy modern app
5. TBD - Deploy traditional app
6. Goto the ARO webconsole and play around with the apps
