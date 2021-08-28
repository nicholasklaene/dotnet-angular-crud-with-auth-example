using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class AuthorizedModel
    {
        public AuthorizedModel(int userId, string username, string _token)
        {
            this.userId = userId;
            this.token = _token;
            this.username = username;
        }
        public string token { get; }
        public int userId { get; }
        public string username { get; set; }
    }
}
