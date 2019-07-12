using Newtonsoft.Json;
using System.IO;
using UserManagement.Contracts.Proxy;

namespace UserManager
{
    public class UserManagerProxy : UserManagementProxy
    {
        public UserManagerProxy(string adfsTrustedEndpointUrl, string relyingPartyIdentifier, string serviceBaseAddress)
            : base(adfsTrustedEndpointUrl, relyingPartyIdentifier, serviceBaseAddress)
        {

        }
        /// <summary>
        /// Control deserialization via Newtonsoft
        /// </summary>
        public override T DeserializeObject<T>(Stream value)
        {
            using (var reader = new StreamReader(value))
            {
                return JsonConvert.DeserializeObject<T>(reader.ReadToEnd());
            }
        }
    }
}
