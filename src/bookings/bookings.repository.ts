import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookingsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    return this.prisma.reservation.create({
      data: {
        restaurantId: createBookingDto.restaurantId,
        userId: createBookingDto.userId,
        reservationDateTime: new Date(createBookingDto.reservationDateTime),
        numberOfGuests: createBookingDto.numberOfGuests,
        specialRequests: createBookingDto.specialRequests,
        guestName: createBookingDto.guestName,
        guestPhone: createBookingDto.guestPhone,
        guestEmail: createBookingDto.guestEmail,
        status: 'pending',
      },
    });
  }

  async findAll(listBookingsDto: ListBookingsDto) {
    const limit = Math.min(parseInt(listBookingsDto.limit || '10'), 100);
    const offset = parseInt(listBookingsDto.offset || '0');

    const where: Prisma.ReservationWhereInput = {
      // deletedAt: null, (soft deletes not in schema)
    };

    if (listBookingsDto.restaurantId) {
      where.restaurantId = listBookingsDto.restaurantId;
    }

    if (listBookingsDto.userId) {
      where.userId = listBookingsDto.userId;
    }

    if (listBookingsDto.status) {
      where.status = {
        equals: listBookingsDto.status,
        mode: 'insensitive',
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        take: limit,
        skip: offset,
        include: { restaurant: true, user: true },
        orderBy: { reservationDateTime: 'desc' },
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return { items, total, limit, offset, pages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { restaurant: true, user: true },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const updateData = { ...updateBookingDto };
    if (updateBookingDto.reservationDateTime) {
      updateData['reservationDateTime'] = new Date(updateBookingDto.reservationDateTime as any);
    }

    return this.prisma.reservation.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { isAvailable: false }, // soft delete simulation
    });
  }

  async exists(id: string): Promise<boolean> {
    const booking = await this.prisma.reservation.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!booking && booking.deletedAt === null;
  }
}
