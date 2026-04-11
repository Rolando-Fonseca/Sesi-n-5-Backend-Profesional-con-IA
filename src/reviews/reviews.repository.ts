import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        restaurantId: createReviewDto.restaurantId,
        userId: createReviewDto.userId,
        rating: createReviewDto.rating,
        title: createReviewDto.title,
        comment: createReviewDto.comment,
      },
    });
  }

  async findAll(listReviewsDto: ListReviewsDto) {
    const limit = Math.min(parseInt(listReviewsDto.limit || '10'), 100);
    const offset = parseInt(listReviewsDto.offset || '0');

    const where: Prisma.ReviewWhereInput = {
      // deletedAt: null, (soft deletes not in schema)
    };

    if (listReviewsDto.restaurantId) {
      where.restaurantId = listReviewsDto.restaurantId;
    }

    if (listReviewsDto.userId) {
      where.userId = listReviewsDto.userId;
    }

    if (listReviewsDto.minRating) {
      where.rating = { gte: listReviewsDto.minRating };
    }

    const orderBy: any = {};
    if (listReviewsDto.sortBy === 'rating') {
      orderBy.rating = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        take: limit,
        skip: offset,
        include: { restaurant: true, user: true },
        orderBy,
      }),
      this.prisma.review.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: { restaurant: true, user: true },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async delete(id: string) {
    return this.prisma.review.update({
      where: { id },
      data: { isAvailable: false }, // soft delete simulation
    });
  }

  async exists(id: string): Promise<boolean> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!review && review.deletedAt === null;
  }
}
