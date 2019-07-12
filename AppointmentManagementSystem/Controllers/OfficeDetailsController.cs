using AppointmentManagementSystem.Security;
using LibTax.AppointmentSystems.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using AppointmentManagementSystem.Common;
using System.Threading.Tasks;
using AppoinmentManagementSystem.Models;

namespace AppointmentManagementSystem.Controllers
{
    public class OfficeDetailsController : BaseController<OfficeDetailsController>
    {
        [HttpGet]
        public JsonResult GetOfficeDetailsByEntity(string entityId)
        {
            
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetOfficeDetailsByEntity).Value + entityId;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetOfficeDetailsByEntity) + entityId;
            List<OfficeDetailsModel> model = null;
            try
            {

                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<OfficeDetailsModel>>(result.Result);

                if (UserSecurity.UserType == "Corporate")
                {
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                List<string> lstOffice = UserSecurity.Offices;
                if (model != null && model.Count > 0 && lstOffice != null && lstOffice.Count > 0)
                {
                    model = model.Where(x => lstOffice.Contains(x.OfficeId)) != null ? model.Where(x => lstOffice.Contains(x.OfficeId)).ToList() : new List<OfficeDetailsModel>();
                }
                else
                {
                    model = new List<OfficeDetailsModel>();
                }
            }
            
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
            
        }

        //TODO: Remove this method and its references from .ts file as it is not being used anymore
        [HttpGet]
        public JsonResult GetEntityDetails()
        {
            List<EntityDetailsModel> model = new List<EntityDetailsModel>();
            try
            {
                EntityDetailsModel details = new EntityDetailsModel()
                {
                    EntityId = "1000",
                    EntityName = string.Empty
                };
                model.Add(details);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAuxBusinessServicesByOfficeId(string officeId)
        {
            List<AuxBusinessServiceModel> model = null;

            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetAuxBusinessServicesByOfficeId).Value + officeId;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetAuxBusinessServicesByOfficeId) + officeId;
            try
            {
                var result = Common.CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<AuxBusinessServiceModel>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetDashBoardData(string durationType)
        {
            List<AuxBusinessServiceModel> model = null;
            // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetDashBoardData).Value + durationType;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetDashBoardData) + durationType;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<AuxBusinessServiceModel>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetOfficeConfigurationHoursDetails(string officeId)
        {
            List<OfficeOperationHoursModel> model = null;
            // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetOfficeOperationHoursByOfficeId).Value + officeId;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetOfficeOperationHoursByOfficeId) + officeId;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<OfficeOperationHoursModel>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeConfigurationHoursDetails", ex.ToString());
            }
            return JsonResult(model, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult UpdateOfficeConfigurationHoursDetails(List<OfficeOperationHoursModel> OfficeOperationHoursData)
        {

            // string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.UpdateOfficeOperationHours).Value;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.UpdateOfficeOperationHours);
            // string apiUrl = "api/OfficeDetails/UpdateOfficeOperationHours";
            OfficeOperationHoursData?.ForEach(OfficeoperationHoursConfig =>
            {
                OfficeoperationHoursConfig.CreatedBy = UserSecurity.Name;
                OfficeoperationHoursConfig.UpdatedBy = UserSecurity.Name;
            });

            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod, OfficeOperationHoursData);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.UpdateOfficeConfigurationHoursDetails", ex.ToString());

            }

            return JsonResult(OfficeOperationHoursData, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId(string officeId, string statusIds, string startDate, string endDate)
        {

            List<object> lstObject = new List<object>();
            List<KeyValuePair<string, string>> lstUrl = new List<KeyValuePair<string, string>>();

            try
            {
                //Fetch the office operation hours.
                lstUrl.Add(new KeyValuePair<string, string>(Constants.GetOfficeOperationHoursByOfficeId, ConfigReader.ReadDatafromConfig(Constants.GetOfficeOperationHoursByOfficeId) + officeId));

                //Fetch Axu business service.
                lstUrl.Add(new KeyValuePair<string, string>(Constants.GetAuxBusinessServicesByOfficeId, ConfigReader.ReadDatafromConfig(Constants.GetAuxBusinessServicesByOfficeId) + officeId));

                //Fetch appointment details.
                startDate = Convert.ToDateTime(startDate).ToString("MM-dd-yyyy");
                endDate = Convert.ToDateTime(endDate).ToString("MM-dd-yyyy");
                lstUrl.Add(new KeyValuePair<string, string>(Constants.GetAppointmentByStatus, ConfigReader.ReadDatafromConfig(Constants.GetAppointmentByStatus) + officeId + "/" + statusIds + "/" + startDate + "/" + endDate));

                //Iterate for each urls.
                foreach (KeyValuePair<string, string> apiUrl in lstUrl)
                {
                    //Call Web api.
                    var result = CommonApiClient.CallWebApiServiceAsync(apiUrl.Value, Request.HttpMethod);
                    if (!String.IsNullOrEmpty(result.Result))
                    {
                        switch (apiUrl.Key)
                        {
                            case Constants.GetOfficeOperationHoursByOfficeId:
                                {
                                    lstObject.Add(JsonConvert.DeserializeObject<List<OfficeOperationHoursModel>>(result.Result));
                                    break;
                                }
                            case Constants.GetAuxBusinessServicesByOfficeId:
                                {
                                    lstObject.Add(JsonConvert.DeserializeObject<List<AuxBusinessServiceModel>>(result.Result));
                                    break;
                                }
                            case Constants.GetAppointmentByStatus:
                                {
                                    lstObject.Add(JsonConvert.DeserializeObject<CalendarAppointmentModel>(result.Result));
                                    break;
                                }
                        }
                    }

                }

            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetAuxBusinessServiceAndOfficeConfigAndAppointmentsbyOfficeId", ex.ToString());
            }
            //Merge the response and return response.            
            return JsonResult(lstObject, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetOfficeDateTime(int timeZoneOffset, string stateCode = "")
        {
            OfficeTimeZoneInfo model=null;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetOfficeDatetimeAndTimeZone) + timeZoneOffset
                + "/" + stateCode;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<OfficeTimeZoneInfo>(result.Result);
                
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "OfficeDetailsController.GetOfficeDateTime", ex.ToString());

            }

            return JsonResult(model, JsonRequestBehavior.AllowGet);

        }
    }
}