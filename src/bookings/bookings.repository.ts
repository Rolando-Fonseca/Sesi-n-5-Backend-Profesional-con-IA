import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { Prisma, ReservationStatus } from '@prisma/client';

@Injectable()
export class BookingsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const reservationDate = new Date(createBookingDto.reservationDateTime);
    return this.prisma.reservation.create({
      data: {
        userId: createBookingDto.userId,
        tableId: createBookingDto.restaurantId,
        reservationDate,
        reservationTime: reservationDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        guestCount: createBookingDto.numberOfGuests,
        specialRequests: createBookingDto.specialRequests,
        status: ReservationStatus.CONFIRMED,
      },
    });
  }

  async findAll(listBookingsDto: ListBookingsDto) {
    const limit = Math.min(parseInt(listBookingsDto.limit || '10'), 100);
    const offset = parseInt(listBookingsDto.offset || '0');

    const where: Prisma.ReservationWhereInput = {};

    if (listBookingsDto.userId) {
      where.userId = listBookingsDto.userId;
    }

    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        take: limit,
        skip: offset,
        include: { table: true, user: true },
        orderBy: { reservationDate: 'desc' },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { table: true, user: true },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const data: Prisma.ReservationUncheckedUpdateInput = {};

    if (updateBookingDto.reservationDateTime) {
      const date = new Date(updateBookingDto.reservationDateTime);
      data.reservationDate = date;
      data.reservationTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    if (updateBookingDto.specialRequests !== undefined) {
      data.specialRequests = updateBookingDto.specialRequests;
    }
    if (updateBookingDto.numberOfGuests !== undefined) {
      data.guestCount = updateBookingDto.numberOfGuests;
    }

    return this.prisma.reservation.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: ReservationStatus) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });
  }

  async exists(id: string): Promise<boolean> {
    const booking = await this.prisma.reservation.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!booking;
  }
}
