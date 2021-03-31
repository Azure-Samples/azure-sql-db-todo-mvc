# Traditional ASP.NET Core App
## How to deploy using the CLI
1. Make sure you are in the right project: `oc project`
2. Add a containerized database: `oc new-app postgresql-ephemeral`
3. Deploy the monolithic app: `oc new-app dotnet:5.0-ubi8~https://github.com/redhat-developer/s2i-dotnetcore-persistent-ex#dotnet-5.0 --context-dir app`
4. Set env vars to connect the database with the app: `oc set env dc/s2i-dotnetcore-persistent-ex --from=secret/postgresql -e database-service=postgresql`
5. Expose the service to the outside: `oc expose service s2i-dotnetcore-persistent-ex`

## TODO
* Connect the caching service to this demo app or provide links on how to do that

## Mapping the monolith to persistent storage using a PVC
A typical challenge with adopting containers is that containers only provide ephemeral storage - if the container is restarted or moves to another Azure VM (aka node), data will be lost. ARO helps with this challenge by providing something known as a persistent volume claim (PVC) that allows you to map to persistent storage without having specific knowledge of the underlying storage infrastructure. The PVC allows this traditional app’s code to remain unchanged because cloud storage can be easily mapped to the container’s local path dynamically via configuration or on demand via ARO’s web UI. Storage options leverage the Azure cloud infrastructure using Azure Disk or Azure File, depending on your app needs.

Let's set that up simply by running the following command:
1. TBD
