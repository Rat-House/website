import type { Record } from 'pocketbase';

declare class User extends Record {
  name: string;
  avatar: string;
  authority: string;
}

declare class Authority extends Record {
  level: number;
  name: string;
}

declare class Tag extends Record {
  name: string;
  description: string;
  colour: string;
}

export { User, Authority, Tag };
