import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'PARTICIPANT' | 'ORGANIZATION';
    organizationId?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: 'PARTICIPANT' | 'ORGANIZATION';
      organizationId?: string;
    };
  }
} 