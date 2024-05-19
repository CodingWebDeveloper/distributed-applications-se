using API.Errors;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CustomAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public CustomAuthorizeAttribute(string role = Constants.USER_ROLE)
        {
            this.Role = role;
        }

        public string Role { get; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // skip authorization if action is decorated with [AllowAnonymous] attribute
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            // authorization
            if (context.HttpContext.User == null)
            {
                context.Result = new JsonResult(new ApiResponse(StatusCodes.Status401Unauthorized)) { StatusCode = StatusCodes.Status401Unauthorized };
                return;
            }

            if (!context.HttpContext.User.IsInRole(this.Role))
            {
                context.Result = new JsonResult(new ApiResponse(StatusCodes.Status403Forbidden)) { StatusCode = StatusCodes.Status403Forbidden };
                return;
            }
        }
    }
}
