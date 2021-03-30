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

## Other Resources
* Another example: https://docs.microsoft.com/en-us/azure/app-service/tutorial-dotnetcore-sqldb-app?pivots=platform-linux