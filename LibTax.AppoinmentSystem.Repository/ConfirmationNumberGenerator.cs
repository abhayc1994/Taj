using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibTax.AppoinmentSystems.Repository
{
  public static  class ConfirmationNumberGenerator
    {
        public static string Generate(string OfficeId, string firstname, string lastname)
        {           
            return string.Format("{0}{1}{2}{3}", OfficeId, string.IsNullOrEmpty(firstname)?"X": firstname.ToUpper().Substring(0, 1), string.IsNullOrEmpty(lastname) ? "X" : lastname.ToUpper().Substring(0, 1), OfficeId.Length == 5 ? GetNumber(3) : GetNumber(4));
        }
        private static Random random = new Random();

        public static string GetNumber(int length)
        {
            var chars = "0123456789";
            var result = new string(
                Enumerable.Repeat(chars, length)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());

            return result;
        }
    }
}
