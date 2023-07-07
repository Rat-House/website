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
  datePublished: string;
}

declare class Contact extends Record {
  name: string;
  user?: string;
  reason?: string;
  email: string;
  message: string;
}

declare class ContactRead extends Record {
  user: string;
  message: string;
}

declare class ReadableContact extends Contact {
  read: boolean;
}

export { User, Authority, Tag, Post, PocketBase, Contact, ContactRead, ReadableContact };
