# DRAFT UNDER CONSTRUCTION

# OpenShift Examples - ARO WebApp with Azure SQL

![License](https://img.shields.io/badge/license-MIT-green.svg)

This is a fork and repurpose of an Azure [ToDoMVC](http://todomvc.com/) app in order to demonstrate the use of Azure Red Hat OpenShift.

The implementation uses
- [Vue.Js](https://vuejs.org/) as front-end client
- [NodeJS](https://nodejs.org/en/) for the back-end logic
- [Azure SQL](https://azure.microsoft.com/en-us/services/sql-database/) as database to store ToDo data
- [GitHub Actions](https://github.com/features/actions)

## Implementation Details

Folder structure

- `/api`: the NodeJs code used to provide the backend API, called by the Vue.Js client
- `/client`: the Vue.Js client. Original source code has been taken from official Vue.js sample and adapted to call a REST client instead of using local storage in order to save and retrieve todos
- `/database`: the T-SQL script needed to setup the object in the Azure SQL database. Take a look at the Stored Procedure to see how you can handle JSON right on Azure SQL

More details are available in this blog post: [TodoMVC Full Stack with Azure Static Web Apps, Node and Azure SQL](https://devblogs.microsoft.com/azure-sql/todomvc-full-stack-with-azure-static-web-apps-node-and-azure-sql/)

## Setup Database

Execute the `/database/create.sql` script on a database of your choice. Could be a local SQL Server or an Azure SQL running in the cloud. Just make sure the desired database is reachable by your local machine (eg: firewall, authentication and so on), then use SQL Server Management Studio or Azure Data Studio to run the script. 

Of course if you want to deploy the solution on Azure, use Azure SQL.

If you need any help in executing the SQL script on Azure SQL, you can find a Quickstart here: [Use Azure Data Studio to connect and query Azure SQL database](https://docs.microsoft.com/en-us/sql/azure-data-studio/quickstart-sql-database).

If you need to create an Azure SQL database from scratch, an Azure SQL S0 database would be more than fine to run the tests.

```
az sql db create -g <resource-group> -s <server-name> -n resiliency_test --service-objective S0
```

Remember that if you don't have Linux environment where you can run [AZ CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) you can always use the [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart). If you prefer to do everything via the portal, here's a tutorial: [Create an Azure SQL Database single database](https://docs.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal).

If you are completely new to Azure SQL, no worries! Here's a full playlist that will help you: [Azure SQL for beginners](https://www.youtube.com/playlist?list=PLlrxD0HtieHi5c9-i_Dnxw9vxBY-TqaeN).
