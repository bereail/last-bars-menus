﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models.Dtos;
using WebApplication1.Models.Dtos.Credentials;
using WebApplication1.Services;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuServices;

        // Inyección de dependencias para el servicio
        public MenuController(IMenuService menuServices)
        {
            _menuServices = menuServices;
        }


        // Obtener todas los Menus
        [HttpGet]
        public async Task<IActionResult> GetAllMenu()
        {
            var menus = await _menuServices.GetAllMenuAsync();
            return Ok(menus);
        }

        [HttpGet("menu-details/{id}")]
        public async Task<IActionResult> GetMenuWithDetails(int id)
        {
            var menuDetails = await _menuServices.GetMenuWithDetailsByIdAsync(id);

            if (menuDetails == null)
            {
                return NotFound(new { Message = "Menu not found" });
            }

            return Ok(menuDetails);
        }
    


    // Obtener un menu por ID
    [HttpGet("menu-get/{id}")]
        public async Task<IActionResult> GetMenuById(int id)
        {
            try
            {
                var bar = await _menuServices.GetMenuByIdAsync(id);
                return Ok(bar);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        [HttpPost("{barId}")]
        public async Task<IActionResult> CreateMenu(int barId, [FromBody] MenuDto menuDto)
        {
            if (menuDto == null)
                return BadRequest(new { message = "Datos del menu no son válidos." });

            try
            {
                var bar = await _menuServices.CreateMenuAsync(menuDto, barId);
                // Devolver el DTO simplificado
                return CreatedAtAction(nameof(GetMenuById), new { id = bar.Id }, bar);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


    }
}