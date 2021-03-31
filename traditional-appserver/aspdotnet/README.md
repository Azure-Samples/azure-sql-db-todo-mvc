# DRAFT UNDER CONSTRUCTION
# Monolithic ASP.NET Core App
This is a modified copy of Microsoft's sample ASP.NET Core reference application. It was built it to demonstrate a single-process (monolithic) application architecture and deployment model. There is a ton of great additional info around this, I've stripped it down into a basic webapp to simplify the example.

## How to deploy using the CLI

### Creating the databases (run once)
There is probably a better way to do this, but for a quick and dirty setup we will do the following to seed our Azure SQL Server database.

1. Ensure your connection strings in `appsettings.json` point to your Azure SQL Server instance. If you lost them you can run `az sql db show-connection-string` or just look in the Azure console. Make sure to replace your user/pass with those you used in the setup script.

2. Find and add your local IP address to the Azure SQL firewall rules (temporarily)
   ```
   curl checkip.dyndns.org
   
   az sql server firewall-rule create --resource-group rg-AroWebAppsExample --server server-arowebappsexample -n AllowYourLocalIp --start-ip-address 71.111.111.111 --end-ip-address 71.111.111.111
   ```

3. Open a command prompt in the Web folder and execute the following commands:

    ```
    cd src/Web
    dotnet restore
    dotnet tool restore
    dotnet ef database update -c catalogcontext -p ../Infrastructure/Infrastructure.csproj -s Web.csproj
    dotnet ef database update -c appidentitydbcontext -p ../Infrastructure/Infrastructure.csproj -s Web.csproj
    ```

    These commands will create two separate databases, one for the store's catalog data and shopping cart information, and one for the app's user credentials and identity data.

### Building our app, configuring to use SQL Server, containerizing, and deploying to ARO
Run the following from the main folder. Again, replacing YOUR_DB_CONN_STR with your connection strings and user/password.

1. `dotnet publish ./eShopOnWeb.sln -f net5.0 -c Release`
2. `oc new-build --name=monolith-app-eshop dotnet:5.0-ubi8 --binary=true `
3. `oc start-build monolith-app-eshop --from-dir=src/Web/bin/Release/net5.0/publish`
4. `oc new-app --name=monolith-app-eshop --image-stream=monolith-app-eshop:latest -e SQLCONNSTR_CatalogConnection="YOUR_DB_CONN_STR" -e SQLCONNSTR_IdentityConnection="YOUR_DB_CONN_STR"`
5. `oc expose service monolith-app-eshop`

Note: We aren't deploying the BlazorAdmin app, but you could by tweaking and performing steps 2-5 for that app also.

Other resources:
* If you're new to .NET development, read the [Getting Started for Beginners](https://github.com/dotnet-architecture/eShopOnWeb/wiki/Getting-Started-for-Beginners) guide.
* Docs for Building [.NET apps on OpenShift](https://access.redhat.com/documentation/en-us/net/5.0/html/getting_started_with_.net_on_rhel_7/using_net_5_0_on_openshift_container_platform#deploying-applications-from-binary-artifacts_using-dotnet-on-openshift-container-platform) 

---

You can read the [original README here](https://github.com/dotnet-architecture/eShopOnWeb).









