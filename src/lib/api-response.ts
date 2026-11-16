import { NextResponse } from "next/server";

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function badRequest(message = "Invalid request") {
  return error(message, 400);
}

export function unauthorized(message = "Unauthorized") {
  return error(message, 401);
}

export function forbidden(message = "Forbidden") {
  return error(message, 403);
}

export function notFound(message = "Not found") {
  return error(message, 404);
}

export function conflict(message = "Conflict") {
  return error(message, 409);
}
