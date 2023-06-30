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

declare class Post extends Record {
  title: string;
  content: string;
  tags: Tagp[];
  creator: string;
  editors: string[];
  published: boolean;
}

export { User, Authority, Tag, Post };
