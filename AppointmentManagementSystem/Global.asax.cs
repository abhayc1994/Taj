using AppoinmentManagementSystem.Services.Exceptions;
using StackExchange.Redis;
using System;
using System.Configuration;
using System.IdentityModel.Services;
using System.IdentityModel.Tokens;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Xml;

namespace ZeeAppointments
{
    public class MvcApplication : System.Web.HttpApplication
    {
        internal static HttpClient httpClientInstance;
        internal string baseUrl = ConfigurationManager.AppSettings["SupportServicesUri"];

        /// <summary>
        /// Provide a property to access the log provider
        /// </summary>
        //private LogProvider _logProvider;
        //internal LogProvider LogProvider
        //{
        //    get
        //    {
        //        return _logProvider ?? (_logProvider = new LogProvider());
        //    }
        //}
        protected void Application_Start()
        {
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            CreateHttpClient();
            // create a log provider with the class name of the inherited class
            EnterpriseLoggingConfigurator.SetLogWriterFactory();
        }



        private void CreateHttpClient()
        {
            httpClientInstance = new HttpClient();
            httpClientInstance.BaseAddress = new Uri(baseUrl);
            httpClientInstance.DefaultRequestHeaders.ConnectionClose = false;

            //ServicePointManager.FindServicePoint
            //(new Uri(baseUrl)).ConnectionLeaseTimeout = 60 * 60 * 1000;
        }

        private void Application_BeginRequest(object sender, EventArgs e)
        {
            //  This corrects WIF error ID3206 "A SignInResponse message may only redirect within the current web application: '/NHP' is not allowed."
            //  For whatever reason, accessing the site without a trailing slash causes this error.
            if (String.Compare(Request.Path, Request.ApplicationPath, StringComparison.InvariantCultureIgnoreCase) == 0 && !(Request.Path.EndsWith("/")))
                Response.Redirect(Request.Path + "/");
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // get the latest error
            var error = Server.GetLastError();
            Logger.Log(error);

            // check the type of error (this will handle weird federation errors)            
            var fedEx = error as FederationException;
            var cryptoEx = error as CryptographicException;
            var redisEx = error as RedisConnectionException;

            // check for System.IdentityModel.Tokens.SecurityTokenException (no token found/expired normally)
            var secutityEx = error as SecurityTokenException;

            // check for a security token error: System.Xml.XmlException: Unexpected end of file. Following elements are not closed: Cookie, SecurityContextToken
            var xmlEx = error as XmlException;


            // signout locally, not remotely.  This will force a new token to be requested
            if (cryptoEx != null || fedEx != null || redisEx != null  || secutityEx != null || xmlEx != null)
            {
                FederatedAuthentication.WSFederationAuthenticationModule.SignOut();
                Server.ClearError();
            }

            HttpException httpException = error as HttpException;

            if (httpException != null)
            {
                string action = string.Empty;

                switch (httpException.GetHttpCode())
                {
                    case 404:
                        // page not found
                        action = "HttpError404";
                        break;
                    case 500:
                        // server error
                        action = "HttpError500";
                        break;
                }
                // clear error on server
                Server.ClearError();

                if (!string.IsNullOrEmpty(action))
                    Response.Redirect(String.Format("~/Error/{0}/?message={1}", action, error.Message));
            }
        }

        public static string VersionNumber
        {
            get
            {
                if (ConfigurationManager.AppSettings["VersionNumber"] == "1.0.0.0")
                    return (System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString());
                return ConfigurationManager.AppSettings["VersionNumber"];
            }
        }
    }
}
