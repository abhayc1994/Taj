using AppointmentManagementSystem.Common;
using AppointmentManagementSystem.Security;
using LibTax.AppointmentSystems.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class CustomerDetailsController : BaseController<CustomerDetailsController>
    {
        // GET: CustomerDetails
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SaveCustomerDetails(CustomerAppointmentDetailsModel customerAppointmentDetailsModel)
        {

            //string apiUrl = "api/CustomerDetails/SaveCustomerDetails";
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.SaveCustomerDetails).Value;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.SaveCustomerDetails);
            customerAppointmentDetailsModel.CreatedBy = UserSecurity.Name;
            customerAppointmentDetailsModel.UpdatedBy = UserSecurity.Name;
            customerAppointmentDetailsModel.CustomerDetails.CreatedBy = UserSecurity.Name;
            //customerAppointmentDetailsModel.startDate = Convert.ToDateTime(!string.IsNullOrEmpty(customerAppointmentDetailsModel.startDateString)? customerAppointmentDetailsModel.startDateString: customerAppointmentDetailsModel.startDate.ToString());
            //customerAppointmentDetailsModel.endDate = Convert.ToDateTime(!string.IsNullOrEmpty(customerAppointmentDetailsModel.endDateString) ? customerAppointmentDetailsModel.endDateString : customerAppointmentDetailsModel.endDate.ToString());
            CustomerResponse model = null;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod, customerAppointmentDetailsModel);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CustomerResponse>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "CustomerDetailsController.SaveCustomerDetails", ex.ToString());
            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCustomerSearchData(CustomerAppointmentSearchModel customerDetailsModel)
        {
            // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetScheduledAppointmentsByCustomer).Value;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetScheduledAppointmentsByCustomer);

            CustomerAppointmentDetailsSearchModel model = null;
            //string apiUrl = "api/CustomerDetails/GetScheduledAppointmentsByCustomer";
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod, customerDetailsModel);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CustomerAppointmentDetailsSearchModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.CustomerAppointmentDetailsSeacrchModel", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetAppointmentsByConfirmationNumber(string confirmationNumber)
        {

            CustomerAppointmentDetailsModel model = null;
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetAppointmentByConfirmationNumber).Value + confirmationNumber;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetAppointmentByConfirmationNumber) + confirmationNumber;
            //string apiUrl = "api/AppointmentDetails/GetAppointmentByConfirmationNumber/" + confirmationNumber;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CustomerAppointmentDetailsModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult getAppointmentByCustomerCMCData(string firstName, string lastName, string last4SSN)
        {

            CustomerAppointmentDetailsModel model = null;
            // string apiUrl = "api/AppointmentDetails/GetAppointmentByCustomerCMCData/" + firstName + "/" + lastName + "/" + last4SSN;
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetAppointmentByCustomerCMCData).Value + firstName + "/" + lastName + "/" + last4SSN;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetAppointmentByCustomerCMCData) + firstName + "/" + lastName + "/" + last4SSN; ;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<CustomerAppointmentDetailsModel>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCMCData()
        {
            List<KeyValuePair<string, string>> lstKeyValue = null;
            try
            {
                if (Session["officeId"].ToString() != "")
                {
                    lstKeyValue = new List<KeyValuePair<string, string>>();
                    lstKeyValue.Add(new KeyValuePair<string, string>("viewDetails", Session["viewDetails"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("firstName", Session["firstName"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("lastName", Session["lastName"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("last4DigitSSN", Session["last4DigitSSN"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("officeId", Session["officeId"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("customerKey", Session["customerKey"].ToString()));
                    lstKeyValue.Add(new KeyValuePair<string, string>("appointmentSource", Session["appointmentSource"].ToString()));
                }
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "CustomerDetailsController.GetCMCData", ex.ToString());
            }
            return Json(lstKeyValue, JsonRequestBehavior.AllowGet);
        }

    }


}