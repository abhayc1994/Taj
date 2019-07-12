using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;

namespace AppointmentManagementSystem.Common
{
    public static class ConfigReader
    {
        internal static IDictionary<string, string> ReadSectionfromConfig(string sectionName="WebAPIResources")
        {
            IDictionary<string, string> dictionary = new Dictionary<string, string>();
           var WebAPIResources = ConfigurationManager.GetSection(sectionName) as NameValueCollection;
            WebAPIResources.AllKeys?.ToList()?.ForEach(x => dictionary.Add(x, WebAPIResources[x]));
            return dictionary;
        }

        internal static string ReadDatafromConfig(string key, string sectionName = "WebAPIResources")
        {
            var WebAPIResources = ConfigurationManager.GetSection(sectionName) as NameValueCollection;
            return WebAPIResources[key];

        }
    }
}