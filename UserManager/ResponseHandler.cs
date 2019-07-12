using System;
using System.Collections.Generic;
using System.Linq;
using UserManagement.Contracts.Responses;

namespace UserManager
{
    public static class ResponseHandler
    {
        private static void Handle<T>(this ApiResponse<T> apiResponse) where T : UserManagement.Contracts.Objects.BaseObject
        {
            if (apiResponse.IsException)
            {
                throw new Exception(apiResponse.ExceptionMessage);
            }
        }

        public static T First<T>(this ApiResponse<T> apiResponse) where T : UserManagement.Contracts.Objects.BaseObject
        {
            apiResponse.Handle();
            return apiResponse.Items.FirstOrDefault();
        }

        public static List<T> All<T>(this ApiResponse<T> apiResponse) where T : UserManagement.Contracts.Objects.BaseObject
        {
            apiResponse.Handle();
            return apiResponse.Items.ToList();
        }
    }
}
