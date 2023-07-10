import type { Record } from 'pocketbase';
import PocketBase from 'pocketbase';

type ReferenceId = string;

declare class User extends Record {
  name: string;
  username: string;
  avatar: string; // file
  authority: ReferenceId;
  bio: ReferenceId;
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
  creator: ReferenceId;
  editors: ReferenceId[];
  published: boolean;
  datePublished: string;
}

declare class Contact extends Record {
  name: string;
  user?: ReferenceId;
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

declare class Bio extends Record {
  bio: string;
}

declare class OathImage extends Record {
  provider: string;
  user: ReferenceId;
  avatar: string; // file
}

export { User, Authority, Tag, Post, PocketBase, Contact, ContactRead, ReadableContact, Bio, OathImage };
