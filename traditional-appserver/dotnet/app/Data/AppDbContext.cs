using Microsoft.EntityFrameworkCore;

namespace RazorPagesContacts.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
    }

    // This derived class is used to distinguish migrations for
    // PostgreSQL (which use AppDbContext), and for SQL Server (which use MssqlDbContext).
    // Migrations for SQL Server were generated using 'dotnet ef' tool by executing:
    //
    //   dotnet ef migrations add InitialCreate --context MssqlDbContext --output-dir Migrations/MssqlMigrations
    //
    public class MssqlDbContext : AppDbContext
    {
        public MssqlDbContext(DbContextOptions options)
            : base(options)
        {
        }
    }
}