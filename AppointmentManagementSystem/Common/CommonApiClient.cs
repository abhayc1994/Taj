using Liberty.Enterprise.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using ZeeAppointments;

namespace AppointmentManagementSystem.Common
{
    public class CommonApiClient
    {
        public static string baseUrl = ConfigurationManager.AppSettings["SupportServicesUri"];
        private static ILogProvider logProvider = new LogProvider();


        //[Obsolete("Use CallWebApiServiceAsync Instead",true)]
        // public static string CallWebApiService(string apiUrl)
        // {
        //     string response = string.Empty;
        //     try
        //     {
        //         MvcApplication.httpClientInstance.DefaultRequestHeaders.Clear();
        //         //Define request data format  
        //         MvcApplication.httpClientInstance.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        //         //Sending request to find web api REST service resource using HttpClient  
        //         var apiResponse = MvcApplication.httpClientInstance.GetAsync(apiUrl);
        //         apiResponse.Wait();
        //         var result = apiResponse.Result;

        //         //Checking the response is successful or not which is sent using HttpClient  
        //         if (result.IsSuccessStatusCode)
        //         {
        //             var readTask = result.Content.ReadAsStringAsync();
        //             readTask.Wait();
        //             response = readTask.Result;
        //         }
        //     }
        //     catch (HttpRequestException httpEx)
        //     {
        //         //logProvider.ErrorFormat("Web requst failed for URL : {0} Error: {1}", apiUrl, httpEx.ToString());
        //         throw httpEx;
        //     }
        //     catch (Exception ex)
        //     {
        //         //logProvider.ErrorFormat("URL:{0} Error: {1}", apiUrl, ex.ToString());
        //         throw ex;
        //     }

        //     return response;
        // }
        // [Obsolete("Use CallWebApiServiceAsync Instead", true)]
        // public static async Task<string> CallWebApiServiceAsync(string apiUrl)
        // {
        //     string response = string.Empty;
        //     try
        //     {

        //         MvcApplication.httpClientInstance.DefaultRequestHeaders.Clear();
        //         MvcApplication.httpClientInstance.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //         var apiResponse = MvcApplication.httpClientInstance.GetAsync(apiUrl);
        //         return response = apiResponse.Result.IsSuccessStatusCode ? await apiResponse.Result.Content.ReadAsStringAsync() : string.Empty;


        //     }
        //     catch (HttpRequestException httpEx)
        //     {
        //         //logProvider.ErrorFormat("Web requst failed for URL : {0} Error: {1}", apiUrl, httpEx.ToString());
        //         throw httpEx;
        //     }
        //     catch (Exception ex)
        //     {
        //         //logProvider.ErrorFormat("URL:{0} Error: {1}", apiUrl, ex.ToString());
        //         throw ex;
        //     }
        // }
        //[Obsolete("Use CallWebApiServiceAsync Instead", true)]
        //public static string CallWebApiServicePost(string apiUrl, object model)
        //{
        //    string response = string.Empty;
        //    try
        //    {
        //        var stringContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(model), System.Text.Encoding.UTF8, "application/json");
        //        MvcApplication.httpClientInstance.DefaultRequestHeaders.Clear();
        //        //Define request data format  
        //        MvcApplication.httpClientInstance.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        //        //Sending request to find web api REST service resource using HttpClient  
        //        var apiResponse = MvcApplication.httpClientInstance.PostAsync(apiUrl, stringContent);
        //        apiResponse.Wait();
        //        var result = apiResponse.Result;
        //        //Checking the response is successful or not which is sent using HttpClient  
        //        if (result.IsSuccessStatusCode)
        //        {
        //            var readTask = result.Content.ReadAsStringAsync();
        //            readTask.Wait();
        //            response = readTask.Result;
        //        }
        //    }
        //    catch (HttpRequestException httpEx)
        //    {
        //        //logProvider.ErrorFormat("Web requst failed for URL : {0} Error: {1}", apiUrl, httpEx.ToString());
        //        throw httpEx;
        //    }
        //    catch (Exception ex)
        //    {
        //        //logProvider.ErrorFormat("URL:{0} Error: {1}", apiUrl, ex.ToString());
        //        throw ex;
        //    }

        //    return response;
        //}
        //[Obsolete("Use CallWebApiServiceAsync Instead", true)]
        //public static async Task<string> CallWebApiServicePostAsync(string apiUrl, object model)
        //{

        //    string response = string.Empty;
        //    try
        //    {
        //        var stringContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(model), System.Text.Encoding.UTF8, "application/json");
        //        MvcApplication.httpClientInstance.DefaultRequestHeaders.Clear();
        //        MvcApplication.httpClientInstance.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        var apiResponse = MvcApplication.httpClientInstance.PostAsync(apiUrl, stringContent);
        //        return response = apiResponse.Result.IsSuccessStatusCode ? await apiResponse.Result.Content.ReadAsStringAsync() : string.Empty;

        //    }
        //    catch (HttpRequestException httpEx)
        //    {
        //        //logProvider.ErrorFormat("Web requst failed for URL : {0} Error: {1}", apiUrl, httpEx.ToString());
        //        throw httpEx;
        //    }
        //    catch (Exception ex)
        //    {
        //        //logProvider.ErrorFormat("URL:{0} Error: {1}", apiUrl, ex.ToString());
        //        throw ex;
        //    }
        //}

        public static Task<string> CallWebApiServiceAsync(string apiUrl, string methodType, object model = null)
        {

            Task<string> response = null;
            Task<HttpResponseMessage> apiResponse = null;
            try
            {
                MvcApplication.httpClientInstance.DefaultRequestHeaders.Clear();
                MvcApplication.httpClientInstance.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                switch (methodType)
                {
                    case "GET":
                        apiResponse = MvcApplication.httpClientInstance.GetAsync(apiUrl);
                        break;
                    case "POST":
                        var stringContent = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                        apiResponse = MvcApplication.httpClientInstance.PostAsync(apiUrl, stringContent);
                        break;

                }
                
                //var stringContent = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(model), System.Text.Encoding.UTF8, "application/json");
                return response = apiResponse.Result.IsSuccessStatusCode ? apiResponse.Result.Content.ReadAsStringAsync() : null;

            }
            catch (HttpRequestException httpEx)
            {
                logProvider.ErrorFormat("Web requst failed for URL : {0} Error: {1}", apiUrl, httpEx.ToString());
                throw httpEx;
            }
            catch (Exception ex)
            {
                logProvider.ErrorFormat("URL:{0} Error: {1}", apiUrl, ex.ToString());
                throw ex;
            }
        }

        public static string ReadUrlfromconfig(string APIname)
        {
            var connectionManagerDatabaseServers = ConfigurationManager.GetSection("WebAPIResources") as NameValueCollection;
            return connectionManagerDatabaseServers != null ? Convert.ToString(connectionManagerDatabaseServers[APIname]) : "";

        }

    }
}