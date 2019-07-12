using System.Web;
using System.Web.Optimization;

namespace ZeeAppointments
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/d3-3.5.17.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundle/angular").Include(
            //            "~/Scripts/libs/runtime.js",
            //            "~/Scripts/libs/polyfills.js",
            //            "~/Scripts/libs/main.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/respond.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/dx.spa.css",
                        "~/Content/dx.common.css",
                        "~/Content/dx.light.css",
                        "~/Content/all.min.css",
                                   "~/Content/site.css",
                      "~/Content/hub.css"));
        }
    }
}
