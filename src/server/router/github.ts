import { z } from "zod";
import { createRouter } from "./context";

export const githubRouter = createRouter().query("profile", {
  input: z.string(),
  async resolve({ input }) {
    return await fetch(`https://api.github.com/users/${input}`).then(
      async (res) => {
        const json = await res.json();
        // log json response on server
        console.log(json);
        // return json response to client
        return json;
      }
    );
  },
});
