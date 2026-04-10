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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { BookingResponseDto } from './dto/booking-response.dto';

/**
 * BookingsController
 * 
 * Gestiona las reservaciones de restaurantes.
 * 
 * Ver: api_contracts.md - Sección Reservations
 */
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully', type: BookingResponseDto, isArray: true })
  async findAll(@Query() listBookingsDto: ListBookingsDto) {
    return this.bookingsService.findAll(listBookingsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully', type: BookingResponseDto })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: BookingResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: BookingResponseDto })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async delete(@Param('id') id: string) {
    return this.bookingsService.delete(id);
  }
}
