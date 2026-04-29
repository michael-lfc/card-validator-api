import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { luhnCheck } from "../src/utils/luhn";

// --- Unit tests: Luhn algorithm ---

describe("luhnCheck", () => {
  it("returns true for a valid Visa card number", () => {
    expect(luhnCheck("4532015112830366")).toBe(true);
  });

  it("returns true for a valid Mastercard number", () => {
    expect(luhnCheck("5425233430109903")).toBe(true);
  });

  it("returns false for a number that fails the Luhn check", () => {
    expect(luhnCheck("1234567890123456")).toBe(false);
  });

  it("returns false for non-digit characters", () => {
    expect(luhnCheck("abcd-efgh-ijkl")).toBe(false);
  });

  it("returns false for a number that is too short", () => {
    expect(luhnCheck("123456")).toBe(false);
  });

  it("returns true for a card number with spaces", () => {
    expect(luhnCheck("4532 0151 1283 0366")).toBe(true);
  });

  it("returns true for a card number with dashes", () => {
    expect(luhnCheck("4532-0151-1283-0366")).toBe(true);
  });
});

// --- Integration tests: POST /api/card/validate ---

describe("POST /api/card/validate", () => {
  it("returns 200 and valid:true for a valid card number", async () => {
    const res = await request(app)
      .post("/api/card/validate")
      .send({ cardNumber: "4532015112830366" });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.message).toBe("Card number is valid");
  });

  it("returns 200 and valid:false for an invalid card number", async () => {
    const res = await request(app)
      .post("/api/card/validate")
      .send({ cardNumber: "1234567890123456" });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.message).toBe("Card number is invalid");
  });

  it("returns 400 when cardNumber is missing", async () => {
    const res = await request(app)
      .post("/api/card/validate")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("cardNumber is required");
  });

  it("returns 400 when cardNumber is an empty string", async () => {
    const res = await request(app)
      .post("/api/card/validate")
      .send({ cardNumber: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("cardNumber must not be empty");
  });

  it("returns 400 when cardNumber is an invalid type", async () => {
    const res = await request(app)
      .post("/api/card/validate")
      .send({ cardNumber: ["4532015112830366"] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("cardNumber must be a string or number");
  });
});