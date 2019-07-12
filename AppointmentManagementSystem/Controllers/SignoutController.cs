using System;
using System.IdentityModel.Services;
using System.Web.Mvc;

namespace AppointmentManagementSystem.Controllers
{
    public class SignOutController : BaseController<SignOutController>
        {
            [HttpGet]
            public JsonResult Logout()
            {
                // use the WS Federation module to sign-out from the current session and to base the Issuer signout request
                var federationAuth = FederatedAuthentication.WSFederationAuthenticationModule;
                federationAuth.SignOut(false);

                // generate a WS-Federation Sign-Out Url for the IDP that issued the Claims
                var signOutRequest = new SignOutRequestMessage(new Uri(federationAuth.Issuer), federationAuth.Realm) { Reply = federationAuth.Realm };
                var signOutUrl = signOutRequest.WriteQueryString();

                return Json(signOutUrl, JsonRequestBehavior.AllowGet);
            }
        }
    }