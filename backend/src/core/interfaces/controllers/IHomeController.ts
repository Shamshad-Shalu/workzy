import { RequestHandler } from "express";

export interface IHomeController {
  getHome: RequestHandler;
  listSections: RequestHandler;
  createSection: RequestHandler;
  updateSection: RequestHandler;
  deleteSection: RequestHandler;
  toggleSectionStatus: RequestHandler;
  //   layout
  getLayout: RequestHandler;
  saveLayout: RequestHandler;
}
