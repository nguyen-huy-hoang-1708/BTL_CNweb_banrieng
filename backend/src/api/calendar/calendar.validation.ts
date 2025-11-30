import { ValidationError } from '@/api/auth/auth.validation';

function isValidIsoDate(value?: string) {
  if (!value || typeof value != 'string') {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

export function validateCalendarQuery(query: { start?: string; end?: string }) {
  const errors: ValidationError[] = [];
  if (query.start && !isValidIsoDate(query.start)) {
    errors.push({ field: 'start', message: 'start must be a valid ISO date string' });
  }
  if (query.end && !isValidIsoDate(query.end)) {
    errors.push({ field: 'end', message: 'end must be a valid ISO date string' });
  }
  return errors;
}

export function validateCalendarCreation(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (!body.title || body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title is required and must be at least 3 characters' });
  }
  if (!isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (!isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}

export function validateCalendarUpdate(body: { title?: string; start_utc?: string; end_utc?: string }) {
  const errors: ValidationError[] = [];
  if (body.title && body.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title must be at least 3 characters if provided' });
  }
  if (body.start_utc && !isValidIsoDate(body.start_utc)) {
    errors.push({ field: 'start_utc', message: 'start_utc must be a valid ISO date string' });
  }
  if (body.end_utc && !isValidIsoDate(body.end_utc)) {
    errors.push({ field: 'end_utc', message: 'end_utc must be a valid ISO date string' });
  }
  if (body.start_utc && body.end_utc) {
    const start = new Date(body.start_utc);
    const end = new Date(body.end_utc);
    if (start > end) {
      errors.push({ field: 'end_utc', message: 'end_utc must be after start_utc' });
    }
  }
  return errors;
}
