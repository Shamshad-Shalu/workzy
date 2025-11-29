export interface HasFindById<T> {
  findById(id: string): Promise<T | null>;
}
