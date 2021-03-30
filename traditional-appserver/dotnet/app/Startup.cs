using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RazorPagesContacts.Data;

namespace RazorPagesContacts
{
    enum DbProvider
    {
        InMemory,
        PostgreSQL,
        Mssql
    }

    public class Startup
    {
        public IConfiguration Configuration { get; }
        public ILogger Logger { get; }
        private bool _migrateDatabase = true;

        public Startup(IConfiguration configuration, ILogger<Startup> logger)
        {
            Configuration = configuration;
            Logger = logger;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            (DbProvider dbProvider, string connectionString) = DetermineDatabaseConfiguration();
            switch (dbProvider)
            {
                case DbProvider.PostgreSQL:
                    Logger.LogInformation($"Using PostgreSQL database");
                    services.AddDbContext<AppDbContext>(options =>
                        options.UseNpgsql(connectionString));
                    _migrateDatabase = true;
                    break;
                case DbProvider.InMemory:
                    Logger.LogInformation("Using InMemory database");
                    services.AddDbContext<AppDbContext>(options =>
                              options.UseInMemoryDatabase("name"));
                    _migrateDatabase = false;
                    break;
                case DbProvider.Mssql:
                    Logger.LogInformation("Using Mssql database");
                    services.AddDbContext<AppDbContext, MssqlDbContext>(options =>
                              options.UseSqlServer(connectionString));
                    _migrateDatabase = true;
                    break;
                default:
                    throw new ArgumentException($"Unknown db provider: {dbProvider}");
            }

            services.AddSingleton<AppConfiguration>(new AppConfiguration
            {
                DatabaseProvider = dbProvider.ToString()
            });

            services.AddRazorPages();

        }

        public void Configure(IApplicationBuilder app)
        {
            if (_migrateDatabase)
            {
                MigrateDatabase(app);
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }

        private (DbProvider dbProvider, string connectionString) DetermineDatabaseConfiguration()
        {
            DbProvider? dbProvider = Configuration.GetValue<DbProvider?>("DB_PROVIDER");
            string connectionString = Configuration.GetConnectionString("Database");

            // Explicit configuration.
            if (dbProvider != null && connectionString != null)
            {
                return (dbProvider.Value, connectionString);
            }

            // If there is no explicit configuration, try to pick an appropriate one by inspecting environment variables.
            // We support a PostgreSQL database that was created and linked with odo (https://github.com/openshift/odo).
            // And a secret from 'oc new-app postgresql-ephemeral' augmented with a 'database-service' envvar.
            // Setting 'MSSQL_SA_PASSWORD' uses Sql Server.

            if (dbProvider == null)
            {
                string saPassword = Configuration.GetValue<string>("MSSQL_SA_PASSWORD");
                if (saPassword != null)
                {
                    dbProvider = DbProvider.Mssql;
                }
                else
                {
                    // 'odo' PostgreSQL has a 'uri' envvar that starts with 'postgres://'.
                    string uri = Configuration.GetValue<string>("uri");
                    string database_service = GetOcSetConfigurationValue("database-service");
                    // 'oc' PostgreSQL has a 'database-service' envvar.
                    if ((uri != null && uri.StartsWith("postgres://")) ||
                        (database_service != null))
                    {
                        dbProvider = DbProvider.PostgreSQL;
                    }
                    else
                    {
                        dbProvider = DbProvider.InMemory;
                    }
                }
            }

            switch (dbProvider)
            {
                case DbProvider.PostgreSQL:
                {
                    string database_name = null;
                    string host = null;
                    int port = -1;
                    string password = null;
                    string username = null;

                    // 'odo' environment variables for PostgreSQL.
                    Uri uri = Configuration.GetValue<Uri>("uri");
                    if (uri != null)
                    {
                        database_name = Configuration.GetValue<string>("database_name");
                        password = Configuration.GetValue<string>("password");
                        host = uri.Host;
                        port = uri.Port == -1 ? 5432 : uri.Port;
                        username = Configuration.GetValue<string>("username");
                    }
                    else
                    {
                        host = GetOcSetConfigurationValue("database-service");
                        // 'oc new-app postgresql-ephemeral' environment variables for PostgreSQL.
                        if (host != null)
                        {
                            database_name = GetOcSetConfigurationValue("database-name");
                            username = GetOcSetConfigurationValue("database-user");
                            password = GetOcSetConfigurationValue("database-password");
                            port = 5432;
                        }
                    }

                    connectionString = $"Host={host};Port={port};Database={database_name};Username={username};Password={password}";
                }
                    break;
                case DbProvider.InMemory:
                    break;
                case DbProvider.Mssql:
                {
                    string server = Configuration["MSSQL_SERVICE_NAME"] ?? "localhost";
                    string password = Configuration["MSSQL_SA_PASSWORD"];
                    string user = "sa";
                    string dbName = "myContacts";
                    connectionString = $@"Server={server};Database={dbName};User Id={user};Password={password};";
                }
                    break;
                default:
                    throw new ArgumentException($"Unknown db provider: {dbProvider}");
            }

            return (dbProvider.Value, connectionString);
        }

        private T GetOcSetConfigurationValue<T>(string name)
        {
            return Configuration.GetValue<T>(name) ??
                Configuration.GetValue<T>(name.Replace('-', '_').ToUpper()); // oc set-env --from-secret changes the names.
        }

        private string GetOcSetConfigurationValue(string name)
            => GetOcSetConfigurationValue<string>(name);

        private static void MigrateDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<AppDbContext>())
                {
                    context.Database.Migrate();
                }
            }
        }
    }
}