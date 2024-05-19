using Microsoft.AspNetCore.Http;

namespace Core.Interfaces
{
    public interface ICloudinaryService
    {
        string Upload(IFormFile file);
    }
}
