import { injectable } from "inversify";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeLayoutRepository } from "@/core/interfaces/repositories/IHomeLayoutRepository";
import HomeLayout, { IHomeLayout } from "@/models/homeLayout.model";

@injectable()
export class HomeLayoutRepository
  extends BaseRepository<IHomeLayout>
  implements IHomeLayoutRepository
{
  constructor() {
    super(HomeLayout);
  }
}
