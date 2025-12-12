package com.erapuit.backend.controller;

import com.erapuit.backend.model.Product;
import com.erapuit.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Kõik tooted (frontendi dropdownile)
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAll();
    }

    // Üks toode
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable UUID id) {
        return productService.getById(id);
    }

    // Loo uus toode
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.create(product);
    }

    // Uuenda toodet
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable UUID id, @RequestBody Product updated) {
        return productService.update(id, updated);
    }

    // Kustuta toode
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        productService.delete(id);
    }
}
