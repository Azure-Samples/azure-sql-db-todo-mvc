# Monolithic ASP.NET Core App
This is a modified copy of Microsoft's sample ASP.NET Core reference application. It was built it to demonstrate a single-process (monolithic) application architecture and deployment model. There is a ton of great additional info around this, I've stripped it down into a basic webapp to simplify the example.

## How to deploy using the CLI

### Creating the databases initially
1. Ensure your connection strings in `appsettings.json` point to your Azure SQL Server instance. If you lost them you can run `az sql db show-connection-string` or just look in the Azure console.

2. Open a command prompt in the Web folder and execute the following commands:

    ```
    dotnet restore
    dotnet tool restore
    dotnet ef database update -c catalogcontext -p ../Infrastructure/Infrastructure.csproj -s Web.csproj
    dotnet ef database update -c appidentitydbcontext -p ../Infrastructure/Infrastructure.csproj -s Web.csproj
    ```

    These commands will create two separate databases, one for the store's catalog data and shopping cart information, and one for the app's user credentials and identity data.

### Configuring the sample to use SQL Server

1. dotnet build
2. oc new-build --name=monolith-app-eshop dotnet:5.0-ubi8 --binary=true 
3. oc start-build monolith-app-eshop --from-build=/bin/Release/net5.0/publish
4. oc new-app xxxxx -e SQLCONNSTR_CatalogConnection=YOUR_DB_CONN_STR" -e SQLCONNSTR_IdentityConnection=YOUR_DB_CONN_STR"


Other resources:
* If you're new to .NET development, read the [Getting Started for Beginners](https://github.com/dotnet-architecture/eShopOnWeb/wiki/Getting-Started-for-Beginners) guide.
* Docs for Building [.NET apps on OpenShift](https://access.redhat.com/documentation/en-us/net/5.0/html/getting_started_with_.net_on_rhel_7/using_net_5_0_on_openshift_container_platform#deploying-applications-from-binary-artifacts_using-dotnet-on-openshift-container-platform) 

---

You can read the [original README here](https://github.com/dotnet-architecture/eShopOnWeb).









