using System;
using System.Threading.Tasks;
using IdentityServer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Models.Authentication;
using System.Linq;

namespace IdentityServer.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly UserManager<UserIdentity> _userManager;

        private readonly ILogger<RegisterModel> _logger;

        public RegisterModel(
            ILogger<RegisterModel> logger,
            UserManager<UserIdentity> userManager
        )
        {
            _logger = logger;
            _userManager = userManager;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public RegisterForm RegisterForm { get; set; }

        [BindProperty]
        public string Error { get; protected set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                Error = String.Empty;
                return Page();
            }

            var user = new UserIdentity()
            {
                Id = Guid.NewGuid(),
                FirstName = RegisterForm.FirstName,
                LastName = RegisterForm.LastName,
                Email = RegisterForm.Email,
                Name = RegisterForm.Username,
            };

            var result = await _userManager.CreateAsync(user, RegisterForm.Password);

            if (!result.Succeeded)
            {
                string error = String.Join(",", result.Errors.Select(x => x.Description));
                _logger.LogError("User didn't created", error);
                Error = error;
                return Page();
            }

            _logger.LogInformation("User created successfuly");
            Error = String.Empty;
            return Page();
        }
    }
}