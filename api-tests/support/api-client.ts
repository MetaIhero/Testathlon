import { APIRequestContext } from "@playwright/test";
import { AuthCredentials, Room, Booking, Message } from "./types";

export class ApiClient {
  private token: string | null = null;

  constructor(private request: APIRequestContext) {}

  // --- Auth ---

  async login(credentials: AuthCredentials): Promise<string> {
    const response = await this.request.post("/auth/login", {
      data: credentials,
    });
    const cookies = response.headers()["set-cookie"] || "";
    const match = cookies.match(/token=([^;]+)/);
    this.token = match ? match[1] : "";
    return this.token;
  }

  async validate(token: string): Promise<number> {
    const response = await this.request.post("/auth/validate", {
      data: { token },
    });
    return response.status();
  }

  // --- Rooms ---

  async getRooms(): Promise<{ status: number; body: any }> {
    const response = await this.request.get("/room/");
    return { status: response.status(), body: await response.json() };
  }

  async getRoom(id: number): Promise<{ status: number; body: Room }> {
    const response = await this.request.get(`/room/${id}`);
    return { status: response.status(), body: await response.json() };
  }

  async createRoom(
    room: Omit<Room, "roomid">
  ): Promise<{ status: number; body: Room }> {
    const response = await this.request.post("/room/", {
      data: room,
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async updateRoom(
    id: number,
    room: Omit<Room, "roomid">
  ): Promise<{ status: number; body: Room }> {
    const response = await this.request.put(`/room/${id}`, {
      data: room,
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async deleteRoom(id: number): Promise<number> {
    const response = await this.request.delete(`/room/${id}`, {
      headers: this.authCookieHeader(),
    });
    return response.status();
  }

  // --- Booking ---

  async getBookings(roomid?: number): Promise<{ status: number; body: any }> {
    const url = roomid ? `/booking/?roomid=${roomid}` : "/booking/";
    const response = await this.request.get(url, {
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async createBooking(
    booking: Omit<Booking, "bookingid">
  ): Promise<{ status: number; body: any }> {
    const response = await this.request.post("/booking/", {
      data: booking,
    });
    return { status: response.status(), body: await response.json() };
  }

  async deleteBooking(id: number): Promise<number> {
    const response = await this.request.delete(`/booking/${id}`, {
      headers: this.authCookieHeader(),
    });
    return response.status();
  }

  // --- Messages ---

  async getMessages(): Promise<{ status: number; body: any }> {
    const response = await this.request.get("/message/", {
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async createMessage(
    message: Omit<Message, "messageid">
  ): Promise<{ status: number; body: Message }> {
    const response = await this.request.post("/message/", {
      data: message,
    });
    return { status: response.status(), body: await response.json() };
  }

  async getMessage(
    id: number
  ): Promise<{ status: number; body: Message }> {
    const response = await this.request.get(`/message/${id}`, {
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  async deleteMessage(id: number): Promise<number> {
    const response = await this.request.delete(`/message/${id}`, {
      headers: this.authCookieHeader(),
    });
    return response.status();
  }

  async getMessageCount(): Promise<{
    status: number;
    body: { count: number };
  }> {
    const response = await this.request.get("/message/count", {
      headers: this.authCookieHeader(),
    });
    return { status: response.status(), body: await response.json() };
  }

  // --- Internal ---

  private authCookieHeader(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }
}
