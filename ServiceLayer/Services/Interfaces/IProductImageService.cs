﻿using DomainLayer.Entities;
using ServiceLayer.ViewModels.AdminVM.ProductVM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services.Interfaces
{
    public interface IProductImageService
    {
        Task AddRangeAsync(IEnumerable<ProductImage> model);
        Task<IEnumerable<ProductImage>> GetAllAsync();
        Task<ProductImage> GetByIdAsync(int id);
        Task DeleteAsync(ProductImage image);
        Task EditAsync(ProductImage image);
    }
}
