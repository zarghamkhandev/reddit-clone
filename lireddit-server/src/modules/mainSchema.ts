import { postTypeDefs } from './post/schema';
import { rootTypeDefs } from './root/schema';
import { sharedTypeDefs } from './shared/schema';

export default [rootTypeDefs, postTypeDefs, sharedTypeDefs];
