package com.erapuit.backend.service;

import com.erapuit.backend.model.Product;
import com.erapuit.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product getById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    public Product create(Product product) {
        // Kui mõned mõõtmed on puudu, me ei viska viga, vaid jätame need nulliks.
        return productRepository.save(product);
    }

    public Product update(UUID id, Product updated) {
        return productRepository.findById(id)
                .map(existing -> {

                    // Tekstiväljad
                    if (updated.getName() != null)
                        existing.setName(updated.getName());

                    if (updated.getSpecies() != null)
                        existing.setSpecies(updated.getSpecies());

                    if (updated.getAssortment() != null)
                        existing.setAssortment(updated.getAssortment());

                    // BigDecimal mõõtmed
                    if (updated.getThicknessMm() != null)
                        existing.setThicknessMm(updated.getThicknessMm());

                    if (updated.getWidthMm() != null)
                        existing.setWidthMm(updated.getWidthMm());

                    if (updated.getLengthMm() != null)
                        existing.setLengthMm(updated.getLengthMm());

                    // arvuline kogus
                    if (updated.getDefaultPieceCount() != null)
                        existing.setDefaultPieceCount(updated.getDefaultPieceCount());

                    // hind
                    if (updated.getPricePerM3() != null)
                        existing.setPricePerM3(updated.getPricePerM3());

                    return productRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    public void delete(UUID id) {
        productRepository.deleteById(id);
    }
}
