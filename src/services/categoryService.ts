// src/services/categoryService.ts
import api from "./api";
import { ProductCategory } from "@/types/shop";

export const categoryService = {
    getCategories: async (): Promise<ProductCategory[]> => {
        const response = await api.get("/shop/categories/");
        return response.data.results || [];
    },

    getCategoryBySlug: async (slug: string): Promise<ProductCategory> => {
        const response = await api.get(`/shop/categories/${slug}/`);
        return response.data;
    },

    // Helper function to organize categories into a hierarchical structure
    buildCategoryTree: (categories: ProductCategory[]): ProductCategory[] => {
        const categoryMap = new Map<string, ProductCategory>();
        const rootCategories: ProductCategory[] = [];

        // First pass: create map of all categories by ID
        categories.forEach(category => {
            // Create a new object with empty children array
            const categoryWithChildren = {
                ...category,
                children: []
            };
            categoryMap.set(category.id, categoryWithChildren);
        });

        // Second pass: build the tree structure
        categories.forEach(category => {
            const categoryWithChildren = categoryMap.get(category.id);
            if (categoryWithChildren) {
                if (category.parent_id) {
                    // This is a child category, add it to its parent
                    const parent = categoryMap.get(category.parent_id);
                    if (parent && parent.children) {
                        parent.children.push(categoryWithChildren);
                    }
                } else {
                    // This is a root category
                    rootCategories.push(categoryWithChildren);
                }
            }
        });

        return rootCategories;
    }
};