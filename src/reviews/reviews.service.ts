import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private reviewsRepository: ReviewsRepository) {}

  async create(createReviewDto: CreateReviewDto) {
    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    try {
      const review = await this.reviewsRepository.create(createReviewDto);
      return {
        statusCode: 201,
        message: 'Review created successfully',
        data: review,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(listReviewsDto: ListReviewsDto) {
    const result = await this.reviewsRepository.findAll(listReviewsDto);
    return {
      statusCode: 200,
      message: 'Reviews retrieved successfully',
      data: result.items,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        pages: result.pages,
        currentPage: Math.floor(result.offset / result.limit) + 1,
      },
    };
  }

  async findById(id: string) {
    const review = await this.reviewsRepository.findById(id);
    if (!review || review.deletedAt) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Review retrieved successfully',
      data: review,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const exists = await this.reviewsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    if (updateReviewDto.rating && (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.reviewsRepository.update(id, updateReviewDto);
    return {
      statusCode: 200,
      message: 'Review updated successfully',
      data: review,
    };
  }

  async delete(id: string) {
    const exists = await this.reviewsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    await this.reviewsRepository.delete(id);
    return {
      statusCode: 200,
      message: 'Review deleted successfully',
    };
  }
}
