using AppoinmentManagementSystem.Models;
using AppointmentManagementSystem.Security;
using LibTax.AppointmentSystems.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using AppointmentManagementSystem.Common;
using System.Threading.Tasks;

namespace AppointmentManagementSystem.Controllers
{
    public class AppointmentDetailsController : BaseController<CustomerDetailsController>
    {

        // GET: AppointmentDetails
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetScheduledAppointmentsByOfficeAndStatus(string officeId, int statusId, string startDate, string endDate)
        {
            // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetScheduledAppointmentsByOfficeAsync).Value + officeId + "/" + statusId + "/" + startDate + "/" + endDate; ;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetScheduledAppointmentsByOfficeAsync) + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            CalendarAppointmentModel model = null;
            // string apiUrl = "api/AppointmentDetails/GetScheduledAppointmentsByOfficeAsync/" + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            // string apiUrl = const + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CalendarAppointmentModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetForcibleAvailableSlots(string officeId, int statusId, string startDate, string endDate)
        {

            CalendarAppointmentModel model = null;
           // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetForcibleAvailableSlots).Value + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetForcibleAvailableSlots) + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            // string apiUrl = "api/AppointmentDetails/GetForcibleAvailableSlots/" + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CalendarAppointmentModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetForcibleAvailableSlots", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateAppointmentDetails(CustomerAppointmentDetailsModel customerAppointmentDetailsModel)
        {
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.UpdateAppointmentStatus).Value;
            //string apiUrl = "api/AppointmentDetails/UpdateAppointmentStatus";
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.UpdateAppointmentStatus);
            customerAppointmentDetailsModel.CreatedBy = UserSecurity.Name;
            customerAppointmentDetailsModel.UpdatedBy = UserSecurity.Name;
            customerAppointmentDetailsModel.CustomerDetails.CreatedBy = UserSecurity.Name;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod, customerAppointmentDetailsModel);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "Appointment.UpdateAppointmentDetails", ex.ToString());

            }

            return JsonResult(customerAppointmentDetailsModel, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetDashBoardData(string durationType)
        {
           // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashBoardData).Value + durationType;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetDashBoardData) + durationType; 
            List<AuxBusinessServiceModel> model = null;
            // string apiUrl = "api/OfficeDetails/GetDashBoardData/" + durationType;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<AuxBusinessServiceModel>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetDashBoardData", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetDashboardDetailsByOfficeId(string officeId, string dashboardType, string startdate, string enddate)
        {

            List<DashboardServiceModel> model = new List<DashboardServiceModel>();
            string apiUrl = "";
            if (string.IsNullOrEmpty(dashboardType))
            {
               // apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashboardMetricsByOfficeId).Value + officeId + "/currentweek?startdate=" + startdate + "&enddate=" + enddate;
                 apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetDashboardMetricsByOfficeId) + officeId + "/currentweek?startdate=" + startdate + "&enddate=" + enddate;
                var res = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(res.Result))
                {
                    model = JsonConvert.DeserializeObject<List<DashboardServiceModel>>(res.Result);
                }
                model?.ForEach(x => x.ViewType = "currentweek");
                dashboardType = "today";
                //apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashboardMetricsByOfficeId).Value + officeId + "/today?startdate=" + startdate + "&enddate=" + enddate;
                apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetDashboardMetricsByOfficeId) + officeId + "/today?startdate=" + startdate + "&enddate=" + enddate;
            }
            else
            {

                //apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashboardMetricsByOfficeId).Value + officeId + "/" + dashboardType + "?startdate=" + startdate + "&enddate=" + enddate;
                apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetDashboardMetricsByOfficeId) + officeId + "/" + dashboardType + "?startdate=" + startdate + "&enddate=" + enddate;
            }

            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                {
                    List<DashboardServiceModel> resmodel = new List<DashboardServiceModel>();
                    resmodel = JsonConvert.DeserializeObject<List<DashboardServiceModel>>(result.Result);
                    resmodel?.ForEach(x => x.ViewType = dashboardType);
                    model?.AddRange(resmodel);
                }

            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetDashboardDetailsByOfficeId", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAvailableSlots(string officeId, int statusId, string startDate, string endDate)
        {
           // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetAvailableSlots).Value + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetAvailableSlots) + officeId + "/" + statusId + "/" + startDate + "/" + endDate;
            CalendarAppointmentModel model = null;
            // string apiUrl = "api/AppointmentDetails/GetAvailableSlots/" + officeId + "/" + statusId + "/" + startDate + "/" + endDate;

            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CalendarAppointmentModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetAvailableSlots", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAppointmentByStatus(string officeId, string statusIds, string startDate, string endDate)
        {

            startDate = Convert.ToDateTime(startDate).ToString("MM-dd-yyyy");
            endDate = Convert.ToDateTime(endDate).ToString("MM-dd-yyyy");
            CalendarAppointmentModel model = null;
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetAppointmentByStatus).Value + officeId + "/" + statusIds + "/" + startDate + "/" + endDate;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetAppointmentByStatus) + officeId + "/" + statusIds + "/" + startDate + "/" + endDate;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CalendarAppointmentModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetAppointmentByStatus", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDayAndWeekAppointmentCount(string officeId, string currentDate, string startdate, string enddate)
        {
            List<DashboardServiceModel> model = new List<DashboardServiceModel>();
            List<KeyValuePair<string, string>> lstUrl = new List<KeyValuePair<string, string>>();
            try
            {
                //Url for week appointment count
                //lstUrl.Add(new KeyValuePair<string, string>("week", (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashboardMetricsByOfficeId).Value + officeId + "/week?startdate=" + startdate + "&enddate=" + enddate));
                lstUrl.Add(new KeyValuePair<string, string>("week", ConfigReader.ReadDatafromConfig(Constants.GetDashboardMetricsByOfficeId) + officeId + "/week?startdate=" + startdate + "&enddate=" + enddate));
                //url for day appoiment count.
                //lstUrl.Add(new KeyValuePair<string, string>("day", (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashboardMetricsByOfficeId).Value + officeId + "/day?startdate=" + currentDate + "&enddate=" + currentDate));
                lstUrl.Add(new KeyValuePair<string, string>("day", ConfigReader.ReadDatafromConfig(Constants.GetDashboardMetricsByOfficeId) + officeId + "/day?startdate=" + currentDate + "&enddate=" + currentDate));

                foreach (KeyValuePair<string, string> strurl in lstUrl)
                {
                    //call web api.
                    var res =  CommonApiClient.CallWebApiServiceAsync(strurl.Value, Request.HttpMethod);
                    if (!String.IsNullOrEmpty(res.Result))
                    {
                        List<DashboardServiceModel> resmodel = JsonConvert.DeserializeObject<List<DashboardServiceModel>>(res.Result);
                        switch (strurl.Key)
                        {
                            case "day":
                                {
                                    //Set ViewType as day for Todays appointment count.
                                    resmodel?.ForEach(x => x.ViewType = "day");
                                    break;
                                }
                            case "week":
                                {
                                    //Set ViewType as week for Week appointment count
                                    resmodel?.ForEach(x => x.ViewType = "week");
                                    break;
                                }
                        }
                        //Add Appointment count into the response object list.
                        model.AddRange(resmodel);
                    }
                }
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "AppointmentDetailsController.GetDayAndWeekAppointmentCount", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

    }


}
