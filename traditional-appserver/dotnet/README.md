# Traditional ASP.NET Core App
We are basically doing a modified version of this demo:
* https://developers.redhat.com/blog/2020/10/27/using-microsoft-sql-server-on-red-hat-openshift/

Using the code originally from here:
* https://github.com/redhat-developer/s2i-dotnetcore-persistent-ex/tree/dotnetcore-3.1-mssql


## How to deploy using the CLI
1. Make sure you are in the right project
$ oc project

2. Add the .NET Core application
$ oc new-app dotnet:3.1~https://github.com/redhat-developer/s2i-dotnetcore-persistent-ex#dotnetcore-3.1-mssql --context-dir app

3. Add env vars from the the sqlserver secret, and database service name envvar.
$ oc set env --from=secret/mssql-secret dc/s2i-dotnetcore-persistent-ex --prefix=MSSQL_

1. Make the .NET Core application accessible externally and show the url
$ oc expose service s2i-dotnetcore-persistent-ex
$ oc get route s2i-dotnetcore-persistent-ex


## TODO
* Connect the caching service to this demo app or provide links on how to do that

## Mapping the monolith to persistent storage using a PVC
A typical challenge with adopting containers is that containers only provide ephemeral storage - if the container is restarted or moves to another Azure VM (aka node), data will be lost. ARO helps with this challenge by providing something known as a persistent volume claim (PVC) that allows you to map to persistent storage without having specific knowledge of the underlying storage infrastructure. The PVC allows this traditional app’s code to remain unchanged because cloud storage can be easily mapped to the container’s local path dynamically via configuration or on demand via ARO’s web UI. Storage options leverage the Azure cloud infrastructure using Azure Disk or Azure File, depending on your app needs.

Let's set that up simply by running the following command:
1. TBD

## Other Resources
* Another example: https://docs.microsoft.com/en-us/azure/app-service/tutorial-dotnetcore-sqldb-app?pivots=platform-linux