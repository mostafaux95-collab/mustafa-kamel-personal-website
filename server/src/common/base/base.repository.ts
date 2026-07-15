/* eslint-disable @typescript-eslint/no-explicit-any */
// Generic soft-delete-aware repository base. Prisma has no first-class
// "mixin" for shared model behavior, so this wraps a model delegate
// (e.g. `prisma.user`) and centralizes the `deletedAt: null` filtering +
// audit-field stamping that every future content table will also need,
// instead of repeating it in each feature repository.
export abstract class BaseRepository<Delegate extends Record<string, any>> {
  protected constructor(protected readonly delegate: Delegate) {}

  findMany(args: Record<string, any> = {}): Promise<any> {
    return this.delegate.findMany({
      ...args,
      where: { ...args.where, deletedAt: null },
    });
  }

  findFirst(args: Record<string, any> = {}): Promise<any> {
    return this.delegate.findFirst({
      ...args,
      where: { ...args.where, deletedAt: null },
    });
  }

  findUnique(args: Record<string, any>): Promise<any> {
    return this.delegate.findUnique(args);
  }

  count(args: Record<string, any> = {}): Promise<number> {
    return this.delegate.count({
      ...args,
      where: { ...args.where, deletedAt: null },
    });
  }

  create(data: Record<string, any>, actorId?: string): Promise<any> {
    return this.delegate.create({
      data: { ...data, createdById: actorId, updatedById: actorId },
    });
  }

  update(where: Record<string, any>, data: Record<string, any>, actorId?: string): Promise<any> {
    return this.delegate.update({
      where,
      data: { ...data, updatedById: actorId },
    });
  }

  // Soft delete: stamps deletedAt instead of removing the row.
  softDelete(where: Record<string, any>, actorId?: string): Promise<any> {
    return this.delegate.update({
      where,
      data: { deletedAt: new Date(), updatedById: actorId },
    });
  }
}
