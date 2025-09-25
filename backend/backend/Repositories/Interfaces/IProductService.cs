using backend.Models.DTOs;

namespace backend.Repositories.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAll();
        Task<IEnumerable<ProductDto>> GetActive();
        Task<ProductDto?> GetById(int id);
        Task<ProductDto> Create(CreateProductDto createProductDto);
        Task<ProductDto?> Update(int id, UpdateProductDto updateProductDto);
        Task<bool> Delete(int id);
    }
}
