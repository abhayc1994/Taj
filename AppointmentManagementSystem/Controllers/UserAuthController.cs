using AppointmentManagementSystem.Common;
using AppointmentManagementSystem.Security;
using LibTax.AppointmentSystems.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class UserAuthController : BaseController<UserAuthController>
    {
        [HttpGet()]
        public JsonResult GetUserDetails()
        {
            object user = new object();
            try
            {
                user = new
                {
                    UserID = UserSecurity.UserId,
                    Name = UserSecurity.Name,
                    UserName = UserSecurity.UserName,
                    UserType = UserSecurity.UserType,
                    Offices = UserSecurity.Offices,
                    EntityId = UserSecurity.EntityId
                };
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "UserAuthController.GetUserDetails", ex.ToString());
            }

            return Json(user, JsonRequestBehavior.AllowGet);
        }


        [HttpGet()]
        public JsonResult GetEntities()
        {
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetEntityDetailsAsync).Value;            
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetEntityDetailsAsync);
            List<EntityDetailsModel> entityDetailsModels = null;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                entityDetailsModels = result?.Result != null ? JsonConvert.DeserializeObject<List<EntityDetailsModel>>(result.Result) : null;
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "UserAuthController.GetEntities", ex.ToString());
            }
            return Json(entityDetailsModels, JsonRequestBehavior.AllowGet);

        }


        private List<OfficeDetailsModel> GetOfficeByentityId(string entityId)
        {

            List<OfficeDetailsModel> model = null;
            //string apiUrl = (TempData.Peek("ConfigData") as IDictionary<string, string>)?.FirstOrDefault(x => x.Key == Constants.GetOfficeDetailsByEntity).Value + entityId;
            string apiUrl = ConfigReader.ReadDatafromConfig(Constants.GetOfficeDetailsByEntity) + entityId;
            try
            {
                var result = CommonApiClient.CallWebApiServiceAsync(apiUrl, Request.HttpMethod);
                if (!String.IsNullOrEmpty(result.Result))
                    model = JsonConvert.DeserializeObject<List<OfficeDetailsModel>>(result.Result);
            }
            catch (Exception ex)
            {
                LogProvider.ErrorFormat("Controller:{0} Error: {1}", "UserAuthController.GetOfficeDetailsByEntity", ex.ToString());

            }
            return model;
        }


    }


}