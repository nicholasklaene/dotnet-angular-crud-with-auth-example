using api.Data;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Authorize]
    [Route("api/todos")]
    [ApiController]
    public class TodoController : ControllerBase
    {

        private readonly ApplicationDbContext _db;

        public TodoController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("{userId:int}")]
        public IActionResult GetAllTodos(int userId)
        {
            IEnumerable<Todo> todos = _db.Todos.Where(todo => todo.UserId == userId);
            return Ok(todos);
        }

        [HttpGet("{userId:int}/{todoId:int}")]
        public IActionResult GetTodo(int userId, int todoId)
        {
            Todo todo = _db.Todos.Find(todoId);
            
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        [HttpPost]
        public IActionResult SaveTodo([FromBody]Todo todo)
        {
            if (!ModelState.IsValid || todo == null)
            {
                return BadRequest();
            }

            _db.Todos.Add(todo);
            if (_db.SaveChanges() == 0)
            {
                return Conflict($"Error creating todo {todo.Description}");
            }

            return Created($"/api/todos/{todo.UserId}/{todo.TodoId}", todo);
        }

        [HttpPut("{userId:int}/{todoId:int}")]
        public IActionResult UpdateTodo(int userId, int todoId, [FromBody] Todo todo)
        {
            if (!ModelState.IsValid || todo == null || todo.TodoId != todoId)
            {
                return BadRequest();
            }

            _db.Todos.Update(todo);

            try
            {
                if (_db.SaveChanges() == 0)
                {
                    return Conflict($"Error updating todo {todoId}");
                }
            } 
            catch (Exception e)
            {
                return Conflict($"Error updating todo {todoId}");
            }

            return NoContent();
        }

        [HttpDelete("{userId:int}/{todoId:int}")]
        public IActionResult DeleteTodo(int userId, int todoId)
        {
            Todo todo =_db.Todos.FirstOrDefault(t => t.TodoId == todoId && t.UserId == userId);
            
            if (todo == null)
            {
                return NotFound();
            }

            _db.Todos.Remove(todo);
            if (_db.SaveChanges() == 0)
            {
                return Conflict($"Error deleting todo {todoId}");
            }

            return NoContent();
        }
    }
}
