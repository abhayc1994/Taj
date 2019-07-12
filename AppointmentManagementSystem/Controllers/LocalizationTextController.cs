using System;
using System.Collections.Generic;
using System.Web.Mvc;


namespace AppointmentManagementSystem.Controllers
{
    public class LocalizationTextController : BaseController<LocalizationTextController>
    {
        // GET: LocalizationText
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetLocalizationtext()
        {
            List<KeyValuePair<string, string>> lstLocText = new List<KeyValuePair<string, string>>();
            try
            {
                lstLocText.Add(new KeyValuePair<string, string>("OptInDisclaimerText", AppointmentManagementSystem.Properties.Resources.OptInDisclaimerText));
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "LocalizationTextController.GetLocalizationtext", ex.ToString());

            }
            return Json(lstLocText, JsonRequestBehavior.AllowGet);
        }

    }
}