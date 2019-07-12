using AppointmentManagementSystem.Common;
using LibTax.AppointmentSystems.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class DashboardController : BaseController<DashboardController>
    {
        [HttpGet]
        public JsonResult GetScheduledAndAvailableSlotsByOfficeId(string officeId, string date)
        {
            date = DateTime.Now.ToString("dddd, dd MMMM yyyy");
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetScheduledAndAvailableSlotsByOfficeId).Value + officeId + "/" + date;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetScheduledAndAvailableSlotsByOfficeId) + officeId + "/" + date;
            List<DashboardAppointmentSlots> model = null;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<DashboardAppointmentSlots>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "DashboardController.DashboardAppointmentSlots", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }
    }
}