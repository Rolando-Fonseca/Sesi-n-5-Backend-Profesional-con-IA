import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';

@Injectable()
export class BookingsService {
  constructor(private bookingsRepository: BookingsRepository) {}

  async create(createBookingDto: CreateBookingDto) {
    const reservationTime = new Date(createBookingDto.reservationDateTime);
    if (reservationTime < new Date()) {
      throw new BadRequestException('Reservation date must be in the future');
    }

    try {
      const booking = await this.bookingsRepository.create(createBookingDto);
      return {
        statusCode: 201,
        message: 'Booking created successfully',
        data: booking,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(listBookingsDto: ListBookingsDto) {
    const result = await this.bookingsRepository.findAll(listBookingsDto);
    return {
      statusCode: 200,
      message: 'Bookings retrieved successfully',
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
    const booking = await this.bookingsRepository.findById(id);
    if (!booking || booking.deletedAt) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return {
      statusCode: 200,
      message: 'Booking retrieved successfully',
      data: booking,
    };
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const exists = await this.bookingsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const booking = await this.bookingsRepository.update(id, updateBookingDto);
    return {
      statusCode: 200,
      message: 'Booking updated successfully',
      data: booking,
    };
  }

  async delete(id: string) {
    const exists = await this.bookingsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    await this.bookingsRepository.delete(id);
    return {
      statusCode: 200,
      message: 'Booking deleted successfully',
    };
  }

  async updateStatus(id: string, status: string) {
    const exists = await this.bookingsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const booking = await this.bookingsRepository.update(id, { status: status as any });
    return {
      statusCode: 200,
      message: 'Booking status updated successfully',
      data: booking,
    };
  }
}
