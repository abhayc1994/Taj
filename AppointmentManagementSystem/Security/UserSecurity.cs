using Liberty.Authorization.Extensions;
using Liberty.Authorization.Principal;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Utilities.ExtensionMethods;

using UserManagement.Contracts.Requests.User;
using UserManagement.Contracts.Objects.User;

namespace AppointmentManagementSystem.Security
{
    public static class UserSecurity
    {
        private const string ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        private const string RoleUserType = "http://schemas.libertytax.net/claims/usertype";

        public static string UserName
        {
            get { return CurrentUser != null ? CurrentUser.UserName : string.Empty; }
        }

        public static UserPrincipal CurrentUser
        {
            get
            {
                return UserPrincipal.GetCurrentUser(ClaimsPrincipal.Current, HttpContext.Current);
            }
        }

        public static string UserType
        {
            get
            {
                if (ClaimsPrincipal.Current.FindFirst(RoleUserType) == null)
                    return "Corporate";
                return ClaimsPrincipal.Current.FindFirst(RoleUserType).Value;
            }

        }

        public static string Name
        {
            get
            {
                return ClaimsPrincipal.Current.Identity.Name;
            }
        }

        public static Guid UserId
        {
            get
            {
                return CurrentUser.UserId ?? new Guid();

            }
        }

        public static List<string> Claims
        {
            get
            {
                return ClaimsPrincipal.Current.GetClaims();
            }
        }

        public static List<string> Roles
        {
            get
            {
                return GetApplicationRoles();
            }
        }

        public static string EntityId
        {
            get
            {
                return ClaimsPrincipal.Current.GetEntity();

            }
        }

        private static List<string> GetApplicationRoles()
        {
            return ClaimsPrincipal.Current.FindAll(ROLE_CLAIM).Select(s => s.Value).ToList();
        }

        public static List<string> Offices
        {
            get
            {
                return ClaimsPrincipal.Current.GetOffices().ToList<string>();
            }
        }

        public static bool CanManageAppointments
        {
            get
            {
                return Roles.Contains("CanManageAppointments");
            }
        }

        public static bool CanCorporateUser
        {
            get
            {
                if (ClaimsPrincipal.Current.FindFirst(RoleUserType) == null)
                    return false;
                return ClaimsPrincipal.Current.FindFirst(RoleUserType).Value.Contains("Corporate");
            }
        }

        public static bool CanAccessAppointmentManagement
        {
            get
            {
                if (ClaimsPrincipal.Current.FindFirst(RoleUserType) == null)
                    return false;
                return (ClaimsPrincipal.Current.FindFirst(RoleUserType).Value.Contains("Franchise"));
            }
        }

        public static bool isLegacyUser
        {
            get
            {
                if (!CanCorporateUser)
                {
                    UserManager.UserManager _usermanagerObj = new UserManager.UserManager();
                    EntityUserDetails _entityUserDetails = null;
                    try
                    {
                        _entityUserDetails = _usermanagerObj?.GetUser(EntityId, UserId);
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                    return _entityUserDetails != null ? _entityUserDetails.IsLegacy : false;
                }
                else
                    return false;
            }
        }
    }
}