using AutoMapper;
using backend.Models.DTOs;
using backend.Models.Entities;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<ProductDto>> GetAll()
        {
            var products = await _productRepository.GetAll();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }
        public async Task<IEnumerable<ProductDto>> GetActive()
        {
            var products = await _productRepository.GetActive();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetById(int id)
        {
            var product = await _productRepository.GetById(id);
            return product != null ? _mapper.Map<ProductDto>(product) : null;
        }

        public async Task<ProductDto> Create(CreateProductDto createProductDto)
        {
            var product = _mapper.Map<Product>(createProductDto);
            var createdProduct = await _productRepository.Create(product);
            return _mapper.Map<ProductDto>(createdProduct);
        }
        
        public async Task<ProductDto?> Update(int id, UpdateProductDto updateProductDto)
        {
            var existingProduct = await _productRepository.GetById(id);
            if (existingProduct == null)
                return null;

            _mapper.Map(updateProductDto, existingProduct);

            var updatedProduct = await _productRepository.Update(existingProduct);
            return _mapper.Map<ProductDto>(updatedProduct);
        }
        public async Task<bool> Delete(int id)
        {
            var exists = await _productRepository.Exists(id);
            if (!exists)
                return false;

            return await _productRepository.Delete(id);
        }
    }
}
