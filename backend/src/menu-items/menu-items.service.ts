import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  private includeRelations = {
    category: true,
    ingredients: {
      include: { ingredient: true },
    },
  };

  async findAll(categoryId?: string) {
    return this.prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(categoryId && { categoryId }),
      },
      orderBy: { sortOrder: 'asc' },
      include: this.includeRelations,
    });
  }

  async findFeatured() {
    return this.prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      orderBy: { sortOrder: 'asc' },
      include: this.includeRelations,
    });
  }

  async findPopular() {
    return this.prisma.menuItem.findMany({
      where: { isPopular: true, isAvailable: true },
      orderBy: { sortOrder: 'asc' },
      include: this.includeRelations,
    });
  }

  async search(query: string) {
    return this.prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: this.includeRelations,
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: this.includeRelations,
    });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async findAllAdmin() {
    return this.prisma.menuItem.findMany({
      orderBy: { sortOrder: 'asc' },
      include: this.includeRelations,
    });
  }

  async create(dto: CreateMenuItemDto) {
    const existing = await this.prisma.menuItem.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const { ingredientIds, ...data } = dto;

    return this.prisma.menuItem.create({
      data: {
        ...data,
        ...(ingredientIds && {
          ingredients: {
            create: ingredientIds.map((id) => ({ ingredientId: id })),
          },
        }),
      },
      include: this.includeRelations,
    });
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    await this.findOne(id);
    const { ingredientIds, ...data } = dto;

    return this.prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        ...(ingredientIds && {
          ingredients: {
            deleteMany: {},
            create: ingredientIds.map((ingId) => ({ ingredientId: ingId })),
          },
        }),
      },
      include: this.includeRelations,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menuItem.delete({ where: { id } });
  }
}