CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('John', 'www.example.com', 'John''s blog');
insert into blogs (author, url, title) values ('James', 'www.example.com', 'James''s blog');