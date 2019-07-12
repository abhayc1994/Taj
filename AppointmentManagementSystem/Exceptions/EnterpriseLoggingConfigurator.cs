using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace AppoinmentManagementSystem.Services.Exceptions
{
    public static class EnterpriseLoggingConfigurator
    {
        public static void SetLogWriterFactory()
        {
            //this should not be necessary but this will prevent from the following error on some systems:
            //"The type Database cannot be constructed. You must configure the container to supply this value."
            DatabaseFactory.SetDatabaseProviderFactory(new DatabaseProviderFactory());
            IConfigurationSource configurationSource = ConfigurationSourceFactory.Create();
            LogWriterFactory logWriterFactory = new LogWriterFactory(configurationSource);
            Microsoft.Practices.EnterpriseLibrary.Logging.Logger.SetLogWriter(logWriterFactory.Create());
        }
    }
}
