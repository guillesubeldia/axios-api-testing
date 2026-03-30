import { expect } from 'chai';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

describe('BookingService', () => {
  let authToken: string;
  let bookingService: BookingService;
  let createdBookingId: number;

  const sampleBooking: Booking = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-07',
    },
    additionalneeds: 'Breakfast',
  };

  before(async () => {
    // I create the token once and reuse it, so every mutating booking call is authenticated.
    const authService = new AuthService();
    const authResponse = await authService.createToken();
    authToken = authResponse.data.token;
    bookingService = new BookingService(authToken);
  });

  describe('GET /booking - getBookingIds', () => {
    it('should return a list of booking IDs', async () => {
      const response = await bookingService.getBookingIds();

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.greaterThan(0);
      response.data.forEach((item) => {
        expect(item).to.have.property('bookingid').that.is.a('number');
      });
    });

    it('should filter bookings by firstname', async () => {
      const response = await bookingService.getBookingIds({ firstname: 'John' });

      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
    });
  });

  describe('POST /booking - createBooking', () => {
    it('should create a new booking and return its ID', async () => {
      const response = await bookingService.createBooking(sampleBooking);

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('bookingid').that.is.a('number');
      expect(response.data).to.have.property('booking');
      expect(response.data.booking.firstname).to.equal(sampleBooking.firstname);
      expect(response.data.booking.lastname).to.equal(sampleBooking.lastname);
      expect(response.data.booking.totalprice).to.equal(sampleBooking.totalprice);
      expect(response.data.booking.depositpaid).to.equal(sampleBooking.depositpaid);

      // I store this id to chain the rest of CRUD tests against the same booking.
      createdBookingId = response.data.bookingid;
    });
  });

  describe('GET /booking/:id - getBooking', () => {
    it('should retrieve a booking by ID', async () => {
      const response = await bookingService.getBooking(createdBookingId);

      expect(response.status).to.equal(200);
      expect(response.data.firstname).to.equal(sampleBooking.firstname);
      expect(response.data.lastname).to.equal(sampleBooking.lastname);
      expect(response.data.totalprice).to.equal(sampleBooking.totalprice);
      expect(response.data.depositpaid).to.equal(sampleBooking.depositpaid);
      expect(response.data.bookingdates.checkin).to.equal(sampleBooking.bookingdates.checkin);
      expect(response.data.bookingdates.checkout).to.equal(sampleBooking.bookingdates.checkout);
    });
  });

  describe('PUT /booking/:id - updateBooking', () => {
    it('should fully update an existing booking', async () => {
      const updatedBooking: Booking = {
        ...sampleBooking,
        firstname: 'Jane',
        lastname: 'Smith',
        totalprice: 200,
      };

      const response = await bookingService.updateBooking(createdBookingId, updatedBooking);

      expect(response.status).to.equal(200);
      expect(response.data.firstname).to.equal('Jane');
      expect(response.data.lastname).to.equal('Smith');
      expect(response.data.totalprice).to.equal(200);
    });
  });

  describe('PATCH /booking/:id - partialUpdateBooking', () => {
    it('should partially update an existing booking', async () => {
      const partialData: Partial<Booking> = {
        firstname: 'UpdatedName',
        additionalneeds: 'Lunch',
      };

      const response = await bookingService.partialUpdateBooking(createdBookingId, partialData);

      expect(response.status).to.equal(200);
      expect(response.data.firstname).to.equal('UpdatedName');
      expect(response.data.additionalneeds).to.equal('Lunch');
    });
  });

  describe('DELETE /booking/:id - deleteBooking', () => {
    it('should delete an existing booking', async () => {
      const response = await bookingService.deleteBooking(createdBookingId);

      expect(response.status).to.equal(201);
    });

    it('should return 404 when trying to get the deleted booking', async () => {
      try {
        await bookingService.getBooking(createdBookingId);
        expect.fail('Expected request to fail with 404');
      } catch (error: unknown) {
        // I assert the API status directly from axios error response, not from a success payload.
        const axiosError = error as { response?: { status: number } };
        expect(axiosError.response?.status).to.equal(404);
      }
    });
  });
});
