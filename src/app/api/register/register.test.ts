import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from "./route";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Mocking prisma và bcryptjs
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password_abc"),
  },
}));

describe("API Đăng ký (Register API)", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Xóa lịch sử mock sau mỗi lần test
  });

  // TEST 1: Đăng ký thành công
  it("nên trả về 201 và thông báo thành công khi dữ liệu hợp lệ", async () => {
    const mockRequestData = { name: "New User", email: "new@example.com", password: "password123" };
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockRequestData),
    });

    // Giả lập logic: Email chưa tồn tại -> findUnique trả về null
    (prisma.user.findUnique as any).mockResolvedValue(null);
    // Giả lập logic: Tạo user thành công
    (prisma.user.create as any).mockResolvedValue({ id: "123", email: mockRequestData.email });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Đăng ký thành công");
    expect(data.user.email).toBe(mockRequestData.email);
  });

  // TEST 2: Thiếu thông tin
  it("nên trả về 400 khi thiếu thông tin đăng ký (ví dụ thiếu email)", async () => {
    const mockRequestData = { name: "New User", password: "password123" }; // Thiếu email
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockRequestData),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Thiếu thông tin đăng ký");
  });

  // TEST 3: Email đã được sử dụng
  it("nên trả về 400 khi email đã tồn tại trong hệ thống", async () => {
    const mockRequestData = { name: "User Duplicate", email: "existed@example.com", password: "password123" };
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockRequestData),
    });

    // Giả lập logic: Email đã tồn tại -> findUnique trả về một user object
    (prisma.user.findUnique as any).mockResolvedValue({ id: "999", email: "existed@example.com" });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email này đã được sử dụng");
    
    // Đảm bảo prisma.user.create không bao giờ được gọi khi email bị trùng
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
