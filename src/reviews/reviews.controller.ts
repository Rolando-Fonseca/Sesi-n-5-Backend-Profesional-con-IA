import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

/**
 * ReviewsController
 * 
 * Gestiona las reseñas y valoraciones de restaurantes.
 * 
 * Ver: api_contracts.md - Sección Reviews
 */
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully', type: ReviewResponseDto, isArray: true })
  async findAll(@Query() listReviewsDto: ListReviewsDto) {
    return this.reviewsService.findAll(listReviewsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
}
