using System;
using System.Diagnostics;
using System.Web.Http.ExceptionHandling;
using Microsoft.Practices.EnterpriseLibrary.Logging;

namespace AppoinmentManagementSystem.Services.Exceptions
{
    public static class Logger
    {
        public static void Log(TraceEventType eventType, string title, string message, string assemblyName)
        {
            //message - Database has a 1500 character restriction on the message column so most of the time the stack trace will get truncated.
            //assemblyName - doesn't seem like this is being stored in the table

            using (var transScope = new System.Transactions.TransactionScope(System.Transactions.TransactionScopeOption.Suppress))
            {
                Microsoft.Practices.EnterpriseLibrary.Logging.Logger.Write(new LogEntry
                {
                    Title = title,
                    Message = message,
                    Severity = eventType,
                    Categories = new[] {assemblyName},
                    ActivityId = Guid.Empty
                });

                transScope.Complete();
            }
        }

        /// <summary>
        /// Log exception
        /// </summary>
        /// <param name="exception"></param>
        public static void Log(Exception exception)
        {
            GlobalExceptionLogger handler = new GlobalExceptionLogger();            
            handler.LogUnHandledException(exception);
        }

    }
}
