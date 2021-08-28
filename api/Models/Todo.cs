using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Todo
    {
        [Key]
        public int TodoId { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public bool Complete { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
