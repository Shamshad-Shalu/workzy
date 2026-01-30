import { RequestHandler } from "express";

export interface ICategoryController {
  getCategories: RequestHandler;
  getCategory: RequestHandler;
  getCategoryAncestors: RequestHandler;
  getCategoryLevels: RequestHandler;
  getCategorySuggestions: RequestHandler;
  getTrendingCategories: RequestHandler;
}
