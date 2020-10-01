import { postTypeDefs } from './post/schema';
import { rootTypeDefs } from './root/schema';
import { sharedTypeDefs } from './shared/schema';
import { userTypeDefs } from './user/schema';

export default [rootTypeDefs, postTypeDefs, sharedTypeDefs, userTypeDefs];
