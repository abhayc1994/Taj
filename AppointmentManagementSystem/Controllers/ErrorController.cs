using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class ErrorController : Controller
    {
             
        public ActionResult HttpError404(string source)
        {
            return View();
            //return View("~/Views/Errors/HttpError404.cshtml");
        }

        public ActionResult HttpError500(string source)
        {
            return View();//("~/Views/Errors/HttpError500.cshtml");
        }
    }
}