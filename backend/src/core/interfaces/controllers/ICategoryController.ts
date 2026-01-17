import { RequestHandler } from "express";

export interface ICategoryController {
  getCategories: RequestHandler;
  getCategory: RequestHandler;
  //   getCategorySuggestions: RequestHandler;
}
