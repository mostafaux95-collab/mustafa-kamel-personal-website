import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Opts an endpoint out of the global JwtAuthGuard (login, refresh,
// forgot/reset-password, verify-email, health).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
