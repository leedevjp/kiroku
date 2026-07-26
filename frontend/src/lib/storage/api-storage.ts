import * as blockApi from "@/features/block/api";
import type { Storage } from "./types";

// Authenticated mode: delegates straight to the existing REST api functions.
export const apiStorage: Storage = blockApi;
