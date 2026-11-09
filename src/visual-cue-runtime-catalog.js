import {VISUAL_CUE_CATALOG} from './visual-cue-catalog.js';
import {VISUAL_CUE_FREQUENCY_CATALOG} from './visual-cue-frequency-catalog.js';
// Legacy and newly introduced recorded replies are disjoint except one documented counting reply reused in the new topic.
// A custom controller catalog is still wholly owned by its caller.
export const VISUAL_CUE_RUNTIME_CATALOG={...VISUAL_CUE_CATALOG,
 assets:{...VISUAL_CUE_CATALOG.assets,...VISUAL_CUE_FREQUENCY_CATALOG.assets},
 bindings:{...VISUAL_CUE_CATALOG.bindings,...VISUAL_CUE_FREQUENCY_CATALOG.bindings}};
