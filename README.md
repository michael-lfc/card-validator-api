# Card Validator API

A REST API that validates card numbers using the Luhn algorithm. Built with Node.js, Express, and TypeScript.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing with Postman](#testing-with-postman)
- [Running Automated Tests](#running-automated-tests)
- [Deployment](#deployment)
- [Design Decisions](#design-decisions)

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/michael-lfc/card-validator-api.git
cd card-validator-api
```

Install dependencies:

```bash
npm install
```

### Running the Server

```bash
# Development — runs with hot reload
npm run dev

# Production — compile first, then start
npm run build
npm start
```

The server runs on port `5000` by default.

---

## Project Structure

```
card-validator-api/
│
├── src/
│   ├── server.ts                   # Entry point — binds app to port
│   ├── app.ts                      # Express app setup
│   ├── routes/
│   │   └── card.routes.ts          # Defines the endpoint
│   ├── controllers/
│   │   └── card.controller.ts      # Handles request and response
│   ├── services/
│   │   └── card.service.ts         # Calls the validation utility
│   ├── utils/
│   │   └── luhn.ts                 # Luhn algorithm logic
│   ├── middleware/
│   │   └── error.middleware.ts     # Global error handling
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
├── tests/
│   └── card.test.ts                # Unit and integration tests
│
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.test.json
└── README.md
```

---

## API Documentation

### Base URL

**Local:**
```
http://localhost:5000
```

**Deployed:**
```
https://card-validator-api-no6a.onrender.com/api/card/validate
```

---

### Endpoint

```
POST /api/card/validate
```

### Request

**Headers**
```
Content-Type: application/json
```

**Body**

| Field | Type | Required | Description |
|---|---|---|---|
| `cardNumber` | `string` or `number` | Yes | The card number to validate. Spaces and dashes are accepted. |

**Example**
```json
{
  "cardNumber": "4532015112830366"
}
```

---

### Responses

| Status Code | Meaning |
|---|---|
| `200` | Request was valid — check the `valid` field for the result |
| `400` | Bad or missing input |
| `500` | Internal server error |

---

**200 — Valid card number**
```json
{
  "valid": true,
  "message": "Card number is valid"
}
```

**200 — Invalid card number**
```json
{
  "valid": false,
  "message": "Card number is invalid"
}
```

**400 — Missing cardNumber field**
```json
{
  "error": "cardNumber is required"
}
```

**400 — Empty string**
```json
{
  "error": "cardNumber must not be empty"
}
```

**400 — Wrong type**
```json
{
  "error": "cardNumber must be a string or number"
}
```

---

## Testing with Postman

Make sure the server is running first:

```bash
npm run dev
```

Open Postman and configure every request as follows:

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/card/validate`
- **Body:** raw → JSON

---

### 1. Valid card number

```json
{ "cardNumber": "4532015112830366" }
```

Expected — `200 OK`:
```json
{ "valid": true, "message": "Card number is valid" }
```

---

### 2. Invalid card number

```json
{ "cardNumber": "1234567890123456" }
```

Expected — `200 OK`:
```json
{ "valid": false, "message": "Card number is invalid" }
```

---

### 3. Card number with spaces (should still pass)

```json
{ "cardNumber": "4532 0151 1283 0366" }
```

Expected — `200 OK`:
```json
{ "valid": true, "message": "Card number is valid" }
```

---

### 4. Card number with dashes (should still pass)

```json
{ "cardNumber": "4532-0151-1283-0366" }
```

Expected — `200 OK`:
```json
{ "valid": true, "message": "Card number is valid" }
```

---

### 5. Missing cardNumber field

```json
{}
```

Expected — `400 Bad Request`:
```json
{ "error": "cardNumber is required" }
```

---

### 6. Empty string

```json
{ "cardNumber": "" }
```

Expected — `400 Bad Request`:
```json
{ "error": "cardNumber must not be empty" }
```

---

### 7. Wrong type

```json
{ "cardNumber": ["4532015112830366"] }
```

Expected — `400 Bad Request`:
```json
{ "error": "cardNumber must be a string or number" }
```

---

## Running Automated Tests

```bash
npm test
```

Expected output:

```
PASS tests/card.test.ts
  luhnCheck
    ✓ returns true for a valid Visa card number
    ✓ returns true for a valid Mastercard number
    ✓ returns false for a number that fails the Luhn check
    ✓ returns false for non-digit characters
    ✓ returns false for a number that is too short
    ✓ returns true for a card number with spaces
    ✓ returns true for a card number with dashes

  POST /api/card/validate
    ✓ returns 200 and valid:true for a valid card number
    ✓ returns 200 and valid:false for an invalid card number
    ✓ returns 400 when cardNumber is missing
    ✓ returns 400 when cardNumber is an empty string
    ✓ returns 400 when cardNumber is an invalid type

Tests: 12 passed, 12 total
```

The test suite includes:

- **Unit tests** — test the Luhn algorithm function directly with known valid and invalid card numbers
- **Integration tests** — simulate real HTTP requests against the endpoint and verify status codes and response bodies

---

## Deployment

The API is deployed on Render and publicly accessible at:

```
https://card-validator-api-no6a.onrender.com/api
```

To test the deployed endpoint on Postman, replace the base URL:

```
POST https://YOUR_RENDER_APP_NAME.onrender.com/api/card/validate
```

Everything else — headers, request body, and expected responses — remains the same as the local setup.

---

## Repository

```
https://github.com/michael-lfc/card-validator-api
```

---

## Design Decisions

### Validation — Luhn Algorithm

Card validation uses the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) (mod 10). This is the industry-standard checksum algorithm used by all major card networks — Visa, Mastercard, Amex, and others — to distinguish valid card numbers from arbitrary digit strings. It catches typos and transposition errors but is not a guarantee that the card account exists. Verifying account existence requires a network call to the card issuer, which is outside the scope of this endpoint.

The implementation also enforces:
- Digit-only input after stripping spaces and dashes
- A length between 13 and 19 digits, which covers all major card formats

### HTTP Status Codes

`400` is returned only when the request itself is malformed — missing field, wrong type, or empty value. The actual valid or invalid result of the card check is always returned as `200` because the request was well-formed and successfully processed. Returning a `4xx` for a card that fails validation would conflate a bad request with a negative result, which are two different things.

### Framework — Express over NestJS

Express was chosen because the project scope is a single endpoint. NestJS brings a powerful module and decorator system that adds real value on larger projects but would be unnecessary overhead here. A flat, explicit route → controller → service structure achieves the same readability and separation without the boilerplate.

### Project Structure

Each layer has a single responsibility and knows nothing about the layers around it:

| Layer | Responsibility |
|---|---|
| `routes/` | Maps URLs to controllers |
| `controllers/` | Handles input validation and response shaping |
| `services/` | Bridges the controller and the utility |
| `utils/` | Pure Luhn algorithm — no HTTP knowledge |
| `middleware/` | Catches and formats all errors |
| `types/` | Defines TypeScript interfaces for request and response |

This means changes to the validation logic only touch `luhn.ts`. Changes to the response shape only touch the controller. Nothing bleeds into anything else.

### app.ts vs server.ts

The Express app is kept separate from the server entry point so that tests can import the app directly without binding a port. If the server startup was inside `app.ts`, every test run would open a port unnecessarily.
