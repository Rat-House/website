import type { Record } from 'pocketbase';
import PocketBase from 'pocketbase';

declare class User extends Record {
  name: string;
  username: string;
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

declare class Contact extends Record {
  name: string;
  user?: string;
  reason?: string;
  email: string;
  message: string;
}

declare class ContactsRead extends Record {
  user: string;
  message: string;
}

export { User, Authority, Tag, Post, PocketBase };
