using AppointmentManagementSystem.Security;
using System;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class HomeController : BaseController<HomeController>
    {
        public ActionResult Index(string firstName = "", string lastName = "", string last4DigitSSN = "", string officeId = "", int customerKey = 0, int appointmentSource = 0, bool viewDetails = false)
        {

            if (!UserSecurity.CanCorporateUser && UserSecurity.isLegacyUser)
            {

                return RedirectToAction("AccessDenied", new { ErrorMsg = "Please login with a named user account to access AMS." });

            }
            //if (!UserSecurity.CanAccessAppointmentManagement && !UserSecurity.CanCorporateUser)
            //{
            //    return RedirectToAction("AccessDenied");
            //}
            try
            {
                Session["firstName"] = firstName;
                Session["lastName"] = lastName;
                Session["last4DigitSSN"] = last4DigitSSN;
                Session["officeId"] = officeId;
                Session["viewDetails"] = viewDetails;
                Session["customerKey"] = customerKey;
                Session["appointmentSource"] = appointmentSource;
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "HomeController.Index", ex.ToString());
            }
            return View();

        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult AccessDenied(string ErrorMsg)
        {
            if (string.IsNullOrEmpty(ErrorMsg))
            {
                ViewBag.ErrMsg = "You are not authorized to view this page. Please contact your administrator.";
            }
            else
            {
                ViewBag.ErrMsg = ErrorMsg;
            }
            return View();
        }
    }
}