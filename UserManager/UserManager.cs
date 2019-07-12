using System;
using System.Collections.Generic;
using System.Configuration;
using System.Xml;
using UserManagement.Contracts.Objects.User;
using UserManagement.Contracts.Requests.User;

namespace UserManager
{
    public class UserManager : IUserManager
    {
        private const string AdfsTrustUrl = "AdfsTrustUrl";
        private const string UserManagmentRootUrl = "UserManagmentRootUrl";
        private readonly string _trustUrl = ConfigurationManager.AppSettings[AdfsTrustUrl];
        private readonly string _relyingParty = ConfigurationManager.AppSettings[UserManagmentRootUrl];
        private readonly string _rootUrl = ConfigurationManager.AppSettings[UserManagmentRootUrl];
              
        public T CallProxy<T>(Func<UserManagerProxy, T> a)
        {
            using (var serviceProxy = new UserManagerProxy(_trustUrl, _relyingParty, _rootUrl))
            {
                try
                {
                    return a(serviceProxy);
                }
                catch (Exception ex)
                {
                    try
                    {
                        int length = 0;

                        foreach (XmlText tokenXmlChildNode in ((System.IdentityModel.Tokens.GenericXmlSecurityToken) serviceProxy.SessionSecurityToken).TokenXml.ChildNodes)
                        {
                            length += tokenXmlChildNode.Length;
                        }

                        ex.Data.Add("SessionSecurityTokenLength", length);
                    }
                    catch (Exception)
                    {
                        //dont want to make things even worse.
                    }

                    throw;
                }
            }
        }


        public List<UserLogin> GetUserLogins(string entityId, Guid userId)
        {
            return CallProxy(p => p.GetUserLogins(entityId, userId).All());
        }     

        
        public List<UserSearchResult> PostUserSearch(UserSearchRequest request)
        {
            return CallProxy(p => p.PostUserSearch(request).All());
        }

        public EntityUserDetails GetUser(string entityId, Guid userId)
        {
            return CallProxy((p) => p.GetUser(entityId, userId).First());
        }


    }
}
