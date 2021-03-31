# Traditional ASP.NET Core App
This is a Red Hat demo example app that uses a containerized database in ARO.

(If you want to see Azure SQL in action choose on of the other traditional app examples)

## How to deploy using the CLI
1. Make sure you are in the right project: `oc project`
2. Add a containerized database: `oc new-app postgresql-persistent`
3. Deploy the monolithic app: `oc new-app dotnet:5.0-ubi8~https://github.com/redhat-developer/s2i-dotnetcore-persistent-ex#dotnet-5.0 --context-dir app --name monolith-app-redhat`
4. Set env vars to connect the database with the app: `oc set env deployment/monolith-app-redhat --from=secret/postgresql -e database-service=postgresql`
5. Expose the service to the outside: `oc expose service monolith-app-redhat`
6. Goto the ARO dashboard and check it out

## Mapping the monolith to persistent storage using a PVC
A typical challenge with adopting containers is that containers only provide ephemeral storage - you can see in this case our databasse is leveraging that capability. See some details in the webconsole or with the following commands:
1. `oc describe pvc postgres` to see the claim that the Postgres requested
2. `oc describe pv` to see all the volumes that have been provisioned for requests (including the one for postgres)
