using System;
using System.Collections.Generic;
using UserManagement.Contracts.Objects;
using UserManagement.Contracts.Objects.Admin;
using UserManagement.Contracts.Objects.Entities;
using UserManagement.Contracts.Objects.Migration;
using UserManagement.Contracts.Objects.User;
using UserManagement.Contracts.Requests.Admin;
using UserManagement.Contracts.Requests.Entity;
using UserManagement.Contracts.Requests.User;
using UserManagement.Contracts.Responses;

namespace UserManager
{
    public interface IUserManager
    {
        T CallProxy<T>(Func<UserManagerProxy, T> a);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="entityId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<UserLogin> GetUserLogins(string entityId, Guid userId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        List<UserSearchResult> PostUserSearch(UserSearchRequest request);

        EntityUserDetails GetUser(string entityId, Guid userId);

    }
}
