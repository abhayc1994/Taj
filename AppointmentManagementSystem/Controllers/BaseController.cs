using Liberty.Enterprise.Logging;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Logging;
using System;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public abstract class BaseController<T> : Controller
    {
        private LogProvider _logProvider;
        internal LogProvider LogProvider
        {
            get
            {
                if (_logProvider != null)
                    return _logProvider;


                _logProvider = new LogProvider();
                _logProvider.SetClassName(typeof(T).FullName);
                return _logProvider;
            }
        }

        // This ActionResult will override the existing JsonResult 
        // and will automatically set the maximum JSON length
        public JsonResult JsonResult(object data, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue // Use this value to set your maximum size for all of your Requests
            };
        }
    }
}