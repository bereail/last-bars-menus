using WebApplication1.Models.Dtos.Credentials;
using WebApplication1.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services
{
    public class MenuService : IMenuService
    {
        private readonly RositaMenuDBContext _context;

        public MenuService(RositaMenuDBContext context)
        {
            _context = context;
        }

        public async Task<MenuDetailsDto> GetMenuWithDetailsByIdAsync(int id)
        {
            var menu = await _context.Menus
                .Include(m => m.Sections)
                    .ThenInclude(s => s.Categories)
                        .ThenInclude(c => c.Products)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menu == null)
            {
                return null; // Maneja el caso de un menú inexistente
            }

            return new MenuDetailsDto
            {
                Id = menu.Id,
                Name = menu.Name,
                Sections = menu.Sections.Select(section => new SectionMenuDetailsDto
                {
                    Id = section.Id,
                    Name = section.Name,
                    Products = section.Categories.SelectMany(c => c.Products).Select(product => new ProductMenuDetailsDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        CategoryName = section.Categories.FirstOrDefault(cat => cat.Products.Contains(product))?.Name // Get the category name
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<List<MenuDto>> GetAllMenuAsync()
        {
            var menus = await _context.Menus
                .Select(c => new MenuDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    BarId = c.BarId
                })
                .ToListAsync();

            return menus;
        }


        public async Task<MenuDto> CreateMenuAsync(MenuDto menuDto, int barId)
        {
            // Verificar que el Bar existe
            var bar = await _context.Bars.FindAsync(barId);
            if (bar == null)
            {
                throw new KeyNotFoundException("El bar especificado no existe.");
            }

            // Crear un nuevo Menu
            var newMenu = new Menu
            {
                Name = menuDto.Name,
                BarId = barId
            };

            // Agregar el nuevo Menu al contexto
            _context.Menus.Add(newMenu);
            await _context.SaveChangesAsync();

            // Proyectar el resultado a MenuDto
            return new MenuDto
            {
                Id = newMenu.Id,
                Name = newMenu.Name,
                BarId = newMenu.BarId
            };
        }


       /* public async Task<List<MenuDto>> GetAllMenuAsync()
        {
            // Proyectar los datos necesarios a MenuDto
            var menus = await _context.Menus
                .Select(c => new MenuDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    BarId = c.BarId
                })
                .ToListAsync();

            return menus;
        }
       */



        public async Task<Menu> GetMenuByIdAsync(int id)
        {
            // Buscar el menú y sus relaciones necesarias
            var menu = await _context.Menus
                .Include(m => m.Bar) // Incluir el bar relacionado, si es necesario
                .FirstOrDefaultAsync(m => m.Id == id);

            // Verificar si el menú no fue encontrado
            if (menu == null)
            {
                throw new KeyNotFoundException("Menú no encontrado.");
            }

            return menu;
        }

    }
}