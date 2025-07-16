import { z } from "zod";

const ConfigSchema = z.object({
  api: z.object({
    url: z.string().url(),
  }),
});

type ConfigType = z.infer<typeof ConfigSchema>;

const config: ConfigType = {
  api: {
    url: import.meta.env.VITE_API_URL,
  },
};

try {
  ConfigSchema.parse(config);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Config validation errors", error);
  }
  throw new Error("Missing config.");
}

export default config;
