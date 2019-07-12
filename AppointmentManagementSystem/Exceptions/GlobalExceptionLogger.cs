using Liberty.Enterprise.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;

namespace AppoinmentManagementSystem.Services.Exceptions
{
    public class GlobalExceptionLogger : IExceptionLogger
    {
        private Exception _exception;
        private readonly string _tokenLength;
        protected const string LineBreak = "\r\n";

        /// <summary>
        /// Required ExceptionLogger method to process an exception
        /// </summary>
        /// <remarks>
        /// Important! Not every ExceptionLoggerContext field will be set depending on where
        /// the exception occurs, but can minimally count on the Exception and Request properties.
        /// </remarks>
        public Task LogAsync(ExceptionLoggerContext context, CancellationToken cancellationToken)
        {
            //throw new ArgumentNullException();

            // STEP 1: do whatever analytics like on the exception
            var ex = context.Exception;

            // example - simple trace logging
            //Trace.WriteLine("*** Exception: " + ex.ToString());
            _exception = context.Exception;
            Handle();
            return Task.FromResult(0);
        }

        /// <summary>
        /// Log un handled exception.
        /// </summary>
        /// <param name="exception"></param>
        public void LogUnHandledException(Exception exception)
        {
            _exception = exception;
            Handle();
        }

        private string GetClassName()
        {
            return _exception.TargetSite.DeclaringType != null ? _exception.TargetSite.DeclaringType.FullName : string.Empty;
        }

        private string GetMethodName()
        {
            return _exception.TargetSite.Name;
        }

        private string GetStackTrace()
        {
            string trace = "Stack Trace:" + _exception.StackTrace;

            Exception ex = _exception.InnerException;

            while (ex != null)
            {
                trace = trace + LineBreak + ex.Message + LineBreak + ex.StackTrace;
                ex = ex.InnerException;
            }

            return trace;
        }

        protected virtual string GetTitle()
        {
            return GetClassName() + " > " + GetMethodName();
        }

        protected virtual string GetMessage()
        {
            return "Message: " + _exception.Message + (_tokenLength != null ? LineBreak + "Token Length: " + _tokenLength : "") + LineBreak + GetStackTrace();
        }

        protected virtual string GetAssemblyName()
        {
            return _exception.TargetSite.DeclaringType != null ? _exception.TargetSite.DeclaringType.Assembly.FullName : "";
        }

        protected virtual TraceEventType GetSeverity()
        {
            return TraceEventType.Error;
        }

        public void Handle()
        {
            Logger.Log(GetSeverity(), GetTitle(), GetMessage(), GetAssemblyName());
        }
    }
}