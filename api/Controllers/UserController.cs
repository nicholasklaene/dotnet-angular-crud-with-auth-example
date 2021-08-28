using api.Models;
using api.Services.Interfaces;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using api.Data;
using Microsoft.AspNetCore.Cors;

namespace api.Controllers
{
    [Authorize]
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IJwtAuthenticationManager jwtAuthenticationManager;
        private readonly ApplicationDbContext _db;

        public UserController(IJwtAuthenticationManager jwtAuthenticationManager, ApplicationDbContext db)
        {
            this._db = db;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] User user)
        {
            if (!ModelState.IsValid || user == null)
            {
                return BadRequest();
            }

            bool userExists = _db.Users.SingleOrDefault(u => u.Username == user.Username) != null;
            if (userExists)
            {
                return Conflict($"User with name {user.Username} already exists.");
            }

            _db.Users.Add(user);
            _db.SaveChanges();
            string token = jwtAuthenticationManager.Authenticate(user.Username, user.Password);
            
            AuthorizedModel authorizedUser = new AuthorizedModel(user.UserId, user.Username, token);
            return Ok(authorizedUser);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserCredentials userCred)
        {
            string token = jwtAuthenticationManager.Authenticate(userCred.Username, userCred.Password);
            if (token == null)
            {
                return Unauthorized();
            }

            User user = _db.Users.FirstOrDefault(u => u.Username == userCred.Username);
            AuthorizedModel authorizedUser = new AuthorizedModel(user.UserId, user.Username, token);
            return Ok(authorizedUser);
        }
    }
}
