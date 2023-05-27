import { randomUUID } from "node:crypto";
import { Database } from "./database/database.js";
import { buildRoutePath } from "./util/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", search ? { title: search } : null);

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (req.body) {
        const { title, description } = req.body;

        const task = {
          id: randomUUID(),
          title,
          description,
          created_at: new Date(),
          updated_at: new Date(),
          completed_at: null,
        };

        database.insert("tasks", task);

        return res.writeHead(201).end();
      }

      return res.writeHead(400).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      if (req.body) {
        const newData = req.body;
        const { id } = req.params;

        const [tasks] = database.select("tasks", { id });

        if (!tasks) {
          return res.writeHead(404).end();
        }

        const data = {
          ...newData,
          updated_at: new Date(),
        };

        database.put("tasks", id, data);

        return res.writeHead(204).end();
      }

      return res.writeHead(400).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      const data = {
        completed_at: new Date(),
      };

      database.put("tasks", id, data);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
