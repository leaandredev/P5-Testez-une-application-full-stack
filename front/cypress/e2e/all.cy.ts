import loginSpec from '../e2e/auth/login.cy';
import logoutSpec from '../e2e/auth/logout.cy';
import registerSpec from '../e2e/auth/register.cy';
import createSessionSpec from '../e2e/sessions/create.cy';
import detailSpec from '../e2e/sessions/detail.cy';
import listSpec from '../e2e/sessions/list.cy';
import updateSessionSpec from '../e2e/sessions/update.cy';
import meSpec from '../e2e/me.cy';
import notFoundSpec from '../e2e/not-found.cy';

loginSpec();
logoutSpec();
registerSpec();
createSessionSpec();
detailSpec();
listSpec();
updateSessionSpec();
meSpec();
notFoundSpec();
