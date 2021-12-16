import { Express } from "express";
import path from "path";
import request from "supertest";
import { createExpressApp } from "../../src/app";
import { createNewPostDB } from "../../src/db";
import { addFixtures } from "../../src/utils";

let server: Express;

beforeAll(async () => {
  createNewPostDB();
  await addFixtures(path.join(__dirname, "../../fixtures/mock_data.json"));
  server = await createExpressApp();
});

describe("POST /api/post", () => {
  it("OK", async () => {
    const endpoint = "/api/post";
    const res = await request(server)
      .post(endpoint)
      .send({
        name: "post 1",
        image: "https://example.com/post1",
        description: "post 1 description"
      })
      .expect(201);

    const post = res.body.data.post;
    expect(post.id).toBeDefined();
    expect(post.dateLastEdited).toBeDefined();
  });
});

describe("GET /api/post", () => {
  it("/api/post", async () => {
    const endpoint = "/api/post";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?page=2", async () => {
    const endpoint = "/api/post?page=2";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?page=2&limit=20", async () => {
    const endpoint = "/api/post?page=2&limit=20";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(20);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(20);
  });

  it("/api/post?page=11", async () => {
    const endpoint = "/api/post?page=11";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(0);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(0);
  });

  it("/api/post?asc=false", async () => {
    const endpoint = "/api/post?asc=false";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.posts[0].id).toEqual(100);
  });

  it("/api/post?sortBy=name", async () => {
    const endpoint = "/api/post?sortBy=name";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?sortBy=name&page=2", async () => {
    const endpoint = "/api/post?sortBy=name&page=2";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?sortBy=name&page=2&limit=20", async () => {
    const endpoint = "/api/post?sortBy=name&page=2&limit=20";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(20);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(20);
  });

  it("/api/post?sortBy=name&page=11", async () => {
    const endpoint = "/api/post?sortBy=name&page=11";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(0);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(0);
  });

  it("/api/post?sortBy=name&asc=false", async () => {
    const endpoint = "/api/post?sortBy=name&asc=false";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.posts[0].id).toEqual(62);
  });

  it("/api/post?searchIn=name&query=customer", async () => {
    const endpoint = "/api/post?searchIn=name&query=customer";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(5);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(5);
  });

  it("/api/post?searchIn=name&query=human", async () => {
    const endpoint = "/api/post?searchIn=name&query=human";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?searchIn=name&query=human&page=1", async () => {
    const endpoint = "/api/post?searchIn=name&query=human&page=1";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(2);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(2);
  });

  it("/api/post?searchIn=name&query=human&page=2", async () => {
    const endpoint = "/api/post?searchIn=name&query=human&page=2";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(0);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(0);
  });

  it("//api/post?query=%22Central%20Research%20Strategist%22", async () => {
    const endpoint = "/api/post?query=%22Central%20Research%20Strategist%22";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(1);
    expect(data.next).toEqual(false);
    expect(data.posts[0].id).toEqual(70);
  });

  it("/api/post?searchIn=description&query=vitae", async () => {
    const endpoint = "/api/post?searchIn=description&query=vitae";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(10);
    expect(data.next).toEqual(true);
    expect(data.posts.length).toEqual(10);
  });

  it("/api/post?searchIn=description&query=vitae&page=1", async () => {
    const endpoint = "/api/post?searchIn=description&query=vitae&page=1";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(8);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(8);
  });

  it("/api/post?searchIn=description&query=vitae&page=2", async () => {
    const endpoint = "/api/post?searchIn=description&query=vitae&page=2";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(0);
    expect(data.next).toEqual(false);
    expect(data.posts.length).toEqual(0);
  });

  it("/api/post?searchIn=description&query=%22Vel%20dolorem%20cupiditate%22", async () => {
    const endpoint =
      "/api/post?searchIn=description&query=%22Vel%20dolorem%20cupiditate%22";
    const res = await request(server).get(endpoint).expect(200);

    const data = res.body.data;
    expect(data.count).toEqual(1);
    expect(data.next).toEqual(false);
    expect(data.posts[0].id).toEqual(70);
  });
});
