import { RequestHandler } from "express";

export interface ICategoryController {
  getCategories: RequestHandler;
  //   getCategorySuggestions: RequestHandler;
}
