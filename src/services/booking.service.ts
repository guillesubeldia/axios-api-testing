import { AxiosResponse } from 'axios';
import { ApiClient } from './api-client';
import { Booking, BookingId, BookingResponse } from '../models/booking.model';

export class BookingService extends ApiClient {
  async getBookingIds(params?: Record<string, string>): Promise<AxiosResponse<BookingId[]>> {
    return this.get<BookingId[]>('/booking', params);
  }

  async getBooking(id: number): Promise<AxiosResponse<Booking>> {
    return this.get<Booking>(`/booking/${id}`);
  }

  async createBooking(booking: Booking): Promise<AxiosResponse<BookingResponse>> {
    return this.post<BookingResponse, Booking>('/booking', booking);
  }

  async updateBooking(id: number, booking: Booking): Promise<AxiosResponse<Booking>> {
    return this.put<Booking, Booking>(`/booking/${id}`, booking);
  }

  async partialUpdateBooking(id: number, data: Partial<Booking>): Promise<AxiosResponse<Booking>> {
    return this.patch<Booking, Booking>(`/booking/${id}`, data);
  }

  async deleteBooking(id: number): Promise<AxiosResponse<string>> {
    return this.delete<string>(`/booking/${id}`);
  }
}
