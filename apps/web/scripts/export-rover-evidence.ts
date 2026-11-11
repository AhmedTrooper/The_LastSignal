/** Local, deterministic source-dossier export. No network, credentials or invented media. */
import { mkdir, writeFile } from "node:fs/promises";
import { GET as lrv } from "../app/api/stories/apollo-15-rover/evidence/route";
import { GET as pathfinder } from "../app/api/stories/pathfinder-sojourner/evidence/route";

const folder = new URL("../docs/research/", import.meta.url);
await mkdir(folder, { recursive: true });
for (const get of [lrv, pathfinder]) {
  const data = await get().json();
  const name = `${data.machineId}-nasa-evidence.json`;
  await writeFile(new URL(name, folder), JSON.stringify(data, null, 2) + "\n");
  console.log(`Exported docs/research/${name}`);
}
