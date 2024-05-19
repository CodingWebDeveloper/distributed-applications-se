using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Core.Helpers;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly IConfiguration configuration;
        private readonly CloudinarySettings cloudinarySettings;
        private readonly Cloudinary cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            this.configuration = configuration;
            this.cloudinarySettings = this.configuration.GetSection("CloudinarySettings").Get<CloudinarySettings>();

            Account account = new Account(
                this.cloudinarySettings.CloudName,
                this.cloudinarySettings.ApiKey,
                this.cloudinarySettings.ApiSecret);

            this.cloudinary = new Cloudinary(account);
        }

        public string Upload(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream)
                    };

                    uploadResult = this.cloudinary.Upload(uploadParams);
                }
            }

            return uploadResult.SecureUrl.ToString();
        }
    }
}
