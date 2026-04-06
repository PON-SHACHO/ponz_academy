
import { getUsers } from '../app/actions/user-actions.js';

async function test() {
  console.log('Fetching users...');
  const users = await getUsers();
  console.log('Users found:', users.length);
  console.log('Users detail:', users);
}

test();
