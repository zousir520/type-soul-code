import { json } from '@sveltejs/kit';

export function respData<T = unknown>(data: T) {
  return respJson(0, "ok", data || []);
}

export function respOk() {
  return respJson(0, "ok");
}

export function respErr(message: string) {
  return respJson(-1, message);
}

export function respJson<T = unknown>(code: number, message: string, data?: T) {
  const response = {
    code: code,
    message: message,
    ...(data && { data: data })
  };

  return json(response);
}

export function respUnauthorized(message: string = "Unauthorized") {
  return json(
    { code: -2, message },
    { status: 401 }
  );
}

export function respBadRequest(message: string = "Bad Request") {
  return json(
    { code: -1, message },
    { status: 400 }
  );
}

export function respInternalError(message: string = "Internal Server Error") {
  return json(
    { code: -1, message },
    { status: 500 }
  );
}
